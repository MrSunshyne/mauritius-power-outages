import type { ApexOptions } from 'apexcharts'

export const labelColor = '#fff'
export const lineColor = '#1D36D1'
export const axisColor = '#ffffff20'

export const genericConfigs: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
    style: {
      colors: [labelColor],
    },
  },
  stroke: {
    curve: 'smooth',
    colors: [lineColor],
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    floating: false,
  },
}

export function useChartConfig() {
  return {
    labelColor,
    lineColor,
    axisColor,
    genericConfigs,
  }
}
