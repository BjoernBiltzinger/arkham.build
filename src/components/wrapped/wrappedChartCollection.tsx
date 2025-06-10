import css from "@/components/wrapped/wrapped.module.css";
import { useStore } from "@/store";
import { selectLocalDecks } from "@/store/selectors/decks";
import { WrappedChart } from "./wrappedChart";
import { getInvestigatorStats } from "./wrappedDataSets";

export default function WrappedChartCollection({
  onlyValid = true,
}: { onlyValid?: boolean }): JSX.Element {
  let localDecks = useStore(selectLocalDecks);

  if (onlyValid) {
    localDecks = localDecks.filter((item) => item.problem === null);
  }
  console.log("localDecks", localDecks);
  const data = getInvestigatorStats(localDecks);
  // const data2 = getCardStats(localDecks);
  // const data3 = getCardTypeStats(localDecks);
  // const data4 = getInvestigatorTypeStats(localDecks);

  return (
    <div className={css["charts-wrap"]}>
      <WrappedChart dataSet={data} fullsize numberDataPoints={5} showRest />
      <WrappedChart
        dataSet={data}
        chartType="pie"
        numberDataPoints={30}
        showRest
      />
      <WrappedChart dataSet={data} numberDataPoints={5} showRest />
      <WrappedChart dataSet={data} numberDataPoints={5} />
      <WrappedChart dataSet={data} fullsize numberDataPoints={5} />
      <WrappedChart dataSet={data} numberDataPoints={5} />
    </div>
  );
}
