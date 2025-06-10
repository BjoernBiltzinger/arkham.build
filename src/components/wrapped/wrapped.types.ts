export type PlotDataPoint = {
  x: string;
  //x: Card | string,
  y: number;
  thumbnailUrl?: string;
  redirectUrl?: string;
};

export type DataSet = {
  data: PlotDataPoint[];
  title?: string;
};
