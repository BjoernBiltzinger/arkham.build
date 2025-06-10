import css from "@/components/wrapped/wrapped.module.css";

interface DeckFilterProps {
  onFilterChange: (filter: boolean) => void;
  value: boolean; // true = valid only, false = all decks
}

export function DeckFilter({ onFilterChange, value }: DeckFilterProps) {
  const handleChange = (newValue: boolean) => {
    console.log("DeckFilter handleChange", newValue);
    onFilterChange(newValue);
  };

  return (
    <div className={css["deckFilter"]}>
      <label className={css["radioLabel"]}>
        <input
          type="radio"
          name="deckFilter"
          value="all"
          checked={!value} // checked when value is false
          onChange={() => handleChange(false)}
          className={css["radioInput"]}
        />
        <span className={css["radioText"]}>Use all decks</span>
      </label>

      <label className={css["radioLabel"]}>
        <input
          type="radio"
          name="deckFilter"
          value="valid"
          checked={value} // checked when value is true
          onChange={() => handleChange(true)}
          className={css["radioInput"]}
        />
        <span className={css["radioText"]}>Use only valid decks</span>
      </label>
    </div>
  );
}
