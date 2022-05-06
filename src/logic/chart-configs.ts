import { ApexOptions } from "apexcharts";


export const labelColor: string = '#fff'
export const lineColor: string = '#1D36D1'
export const axisColor: string = '#ffffff20'
export const genericConfigs: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    }
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
    style: {
      colors: [labelColor],
    }
  },
  stroke: {
    curve: "smooth",
    colors: [lineColor]
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      }
    }
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    floating: false,
  },
}