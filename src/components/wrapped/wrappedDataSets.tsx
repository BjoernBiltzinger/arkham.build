import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { thumbnailUrl as getThumbnailUrl } from "@/utils/card-utils";
import type { SkillIcon } from "@/utils/constants";
import type { DataSet, PlotDataPoint } from "./wrapped.types";

/* Connectors to get information from decks */

function getInvestigatorCardFromDeck(deck: ResolvedDeck): Card {
  return deck.cards.investigator.card;
}

function getSlotCardsFromDeck(
  deck: ResolvedDeck,
): Record<string, { card: Card; quantity: number }> {
  const cardNumbers = deck.slots;

  return Object.values(deck.cards.slots).reduce(
    (result, slot) => {
      const card = slot.card;
      if (!card || !card.code) return result;
      if (!result[card.code]) {
        result[card.code] = {
          card: card,
          quantity: 0,
        };
      }
      result[card.code].quantity += cardNumbers[slot.card.code] ?? 0;
      return result;
    },
    {} as Record<string, { card: Card; quantity: number }>,
  );
}

/* Internal helper functions */

function sortAndLimitDataPoints(
  plotDataPoints: PlotDataPoint[],
  //limit?: number,
): PlotDataPoint[] {
  const sortedData = plotDataPoints.sort((a, b) => b.y - a.y);

  //const limitedData = limit ? sortedData.slice(0, limit) : sortedData;

  return sortedData;
}

function stripKeysFromDict<T>(dict: Record<string, T>): T[] {
  return Object.values(dict);
}

/* Individual Functions to get the datasets we want to use */

export function getInvestigatorStats(decks: ResolvedDeck[]): DataSet {
  const investigatorDict = decks.reduce(
    (result, deck) => {
      const investigatorCard = getInvestigatorCardFromDeck(deck);
      if (!result[investigatorCard.code]) {
        result[investigatorCard.code] = {
          x: investigatorCard.real_name,
          y: 0,
          thumbnailUrl: getThumbnailUrl(investigatorCard.code),
          redirectUrl: `/investigator/${investigatorCard.code}`,
        };
      }
      result[deck.cards.investigator.card.code].y += 1;
      return result;
    },
    {} as Record<string, PlotDataPoint>,
  );

  const investigatorPlotData = sortAndLimitDataPoints(
    stripKeysFromDict(investigatorDict),
  );

  return {
    data: investigatorPlotData,
    title: "Investigators Used",
  };
}

export function getCardStats(decks: ResolvedDeck[]): DataSet {
  const cardDict = decks.reduce(
    (result, deck) => {
      const slotCards = getSlotCardsFromDeck(deck);
      for (const [code, { card, quantity }] of Object.entries(slotCards)) {
        if (!result[code]) {
          result[code] = {
            x: card.real_name,
            y: 0,
            thumbnailUrl: getThumbnailUrl(card.code),
            redirectUrl: `/card/${card.code}`,
          };
        }
        result[code].y += quantity;
      }
      return result;
    },
    {} as Record<string, PlotDataPoint>,
  );

  const cardPlotData: PlotDataPoint[] = sortAndLimitDataPoints(
    stripKeysFromDict(cardDict),
  );

  return {
    data: cardPlotData,
    title: "Cards Used",
  };
}

export function getCardTypeStats(decks: ResolvedDeck[]): DataSet {
  let cardTypePlotData = [
    { x: "skill_agility", y: 0 },
    { x: "skill_combat", y: 0 },
    { x: "skill_intellect", y: 0 },
    { x: "skill_willpower", y: 0 },
    { x: "skill_wild", y: 0 },
  ];

  cardTypePlotData = decks.reduce((result, deck) => {
    const slotCards = getSlotCardsFromDeck(deck);
    for (const [_code, { card, quantity }] of Object.entries(slotCards)) {
      for (const skill of result) {
        const skillName = skill.x as SkillIcon;
        if (card[skillName]) skill.y += card[skillName] * quantity;
      }
    }
    return result;
  }, cardTypePlotData as PlotDataPoint[]);

  cardTypePlotData = sortAndLimitDataPoints(cardTypePlotData);
  return {
    data: cardTypePlotData,
    title: "Cards Type Used",
  };
}

export function getInvestigatorTypeStats(decks: ResolvedDeck[]): DataSet {
  let investigatorFractionPlotData = [
    { x: "guardian", y: 0 },
    { x: "seeker", y: 0 },
    { x: "rogue", y: 0 },
    { x: "mystic", y: 0 },
    { x: "survivor", y: 0 },
    { x: "neutral", y: 0 },
  ];

  investigatorFractionPlotData = decks.reduce((result, deck) => {
    const investigatorCard = getInvestigatorCardFromDeck(deck);
    if (!investigatorCard || !investigatorCard.faction_code) return result;

    const factionIndex = result.findIndex(
      (faction) => faction.x === investigatorCard.faction_code,
    );
    if (factionIndex !== -1) {
      result[factionIndex].y += 1;
    }
    return result;
  }, investigatorFractionPlotData as PlotDataPoint[]);

  investigatorFractionPlotData = sortAndLimitDataPoints(
    investigatorFractionPlotData,
  );

  return {
    data: investigatorFractionPlotData,
    title: "Investigators Fractions Used",
  };
}
