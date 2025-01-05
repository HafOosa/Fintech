export interface HistoricalData {
  date: string;
  time: string;
  price: number;
}

export interface LivePrice {
  price: number;
  timestamp: string;
}

export interface ChartPoint {
  name: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  series: ChartPoint[];
}
