import { ApexOptions } from 'apexcharts'
import { FC } from 'react'
import Chart from 'react-apexcharts'

const DashboardV: FC = () => {
  console.log('DashboardV 1')
  const state: { series: ApexOptions['series']; options: ApexOptions } = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return '$ ' + val + ' thousands'
          },
        },
      },
    },
  }

  return (
    <div>
      <div className='m-10 w-[750px] bg-white'>
        <Chart options={state.options} series={state.series} type='bar' height={400} />
      </div>
    </div>
  )
}

export default DashboardV
