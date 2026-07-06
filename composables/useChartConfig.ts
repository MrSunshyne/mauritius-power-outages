import type { ApexOptions } from 'apexcharts'

export const labelColor = '#fff'
export const lineColor = '#1D36D1'
export const axisColor = '#ffffff20'
// Default Apex bar blue, and the accent used to highlight the "worst" bucket
export const barColor = '#008FFB'
export const highlightColor = '#FF4560'

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
