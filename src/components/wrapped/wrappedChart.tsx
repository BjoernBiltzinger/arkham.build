import {
  chartsTheme,
  containerTheme,
} from "@/components/deck-tools/chart-theme";
import { Plane } from "@/components/ui/plane";
import css from "@/components/wrapped/wrapped.module.css";
import type { DataSet } from "@/components/wrapped/wrapped.types";
import { cx } from "@/utils/cx";
import { useElementSize } from "@/utils/use-element-size";
import { useRef } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryPie,
  VictoryTooltip,
} from "victory";

const chartBuilders = {
  bar: createBarChart,
  pie: createPieChart,
};

interface ChartConfig {
  dataSet: DataSet;
  fullsize?: boolean;
  chartType?: keyof typeof chartBuilders;
  numberDataPoints: number;
  showRest?: boolean;
}

export function WrappedChart({
  dataSet,
  chartType,
  fullsize = false,
  numberDataPoints = 10,
  showRest = false,
}: ChartConfig): JSX.Element {
  const ref = useRef(null);
  const { width } = useElementSize(ref);
  const height = fullsize ? width * 0.3 : width * 0.6;

  const chartBuilder = chartType
    ? chartBuilders[chartType] || createBarChart
    : createBarChart;

  const dataPoints = dataSet.data.slice(0, numberDataPoints);
  if (showRest && dataSet.data.length > numberDataPoints) {
    dataPoints.push({
      x: "Rest",
      y: dataSet.data
        .slice(numberDataPoints)
        .reduce((sum, point) => sum + point.y, 0),
    });
  }

  const dataSetWithLimitedData = {
    ...dataSet,
    data: dataPoints,
  };

  const chart = chartBuilder(dataSetWithLimitedData, width, height);

  return (
    <div
      ref={ref}
      className={cx(css["chart-container"], fullsize ? css["fullsize"] : null)}
    >
      <Plane>
        {width > 0 && (
          <>
            {dataSet.title && (
              <h4 className={css["chart-title"]}>{dataSet.title}</h4>
            )}
            {chart}
          </>
        )}
      </Plane>
    </div>
  );
}

function createBarChart(
  dataSet: DataSet,
  width: number,
  _height: number,
): JSX.Element {
  //const padding = { left: 0.1*width, top: 0.1*width, bottom: 0.1*width, right: 0.1*width }
  const padding = { left: 45, bottom: 40, right: 5, top: 20 };
  const maxValue = Math.max(...dataSet.data.map((d) => d.y));
  const tickValues = Array.from({ length: 5 }, (_, i) =>
    Math.ceil((maxValue / 5) * (i + 1)),
  );
  return (
    <VictoryChart
      width={width}
      //height={height}
      domainPadding={{ x: width * 0.07 }}
      padding={padding}
      theme={chartsTheme}
      containerComponent={
        <VictoryContainer responsive={true} style={containerTheme} />
      }
    >
      <VictoryBar
        data={dataSet.data}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        labelComponent={
          <VictoryTooltip
            labelPlacement="vertical"
            flyoutWidth={200}
            constrainToVisibleArea
            style={{
              fontSize: 20, // Change text size
            }}
          />
        }
      />
      <VictoryAxis
        dependentAxis={false}
        tickLabelComponent={
          <VictoryLabel angle={-45} textAnchor="end" verticalAnchor="middle" />
        }
        style={{
          grid: { stroke: "none" },
          //axis: { stroke: "none", strokeWidth: 1 },
          ticks: { stroke: "none", size: 5 },
          // size of the tick labels
          tickLabels: {
            fontSize: 15,
            fill: "#505050",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
      <VictoryAxis
        dependentAxis={true}
        tickValues={tickValues}
        style={{
          grid: { stroke: "none" },
          //axis: { stroke: "none", strokeWidth: 1 },
          //ticks: { stroke: "none", size: 5 },
          //tickLabels: { fill:"transparent"}
          tickLabels: {
            fontSize: 15,
            fill: "#505050",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </VictoryChart>
  );
}

function createPieChart(
  dataSet: DataSet,
  width: number,
  height: number,
): JSX.Element {
  return (
    <VictoryChart
      width={width}
      height={height}
      theme={chartsTheme}
      containerComponent={
        <VictoryContainer responsive={true} style={containerTheme} />
      }
      padding={{ top: 100, bottom: 100, left: 100, right: 100 }}
    >
      <VictoryPie
        data={dataSet.data}
        labelPlacement="parallel"
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
      />
      <VictoryAxis
        dependentAxis={false}
        style={{
          axis: { stroke: "transparent" }, // Hide axis line
          ticks: { stroke: "transparent" }, // Hide tick marks
          tickLabels: { fill: "transparent" }, // Hide tick labels
          grid: { stroke: "transparent" }, // Hide grid lines
        }}
      />

      {/* Y-axis invisible */}
      <VictoryAxis
        dependentAxis={true}
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
          grid: { stroke: "transparent" },
        }}
      />
    </VictoryChart>
  );
}
