import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Population {
  name: string
  popData: {
    year: number
    value: number
  }[]
}

interface ResultData {
  year: number
  [key: string]: number | null
}

export const LineGraph = (props: { props: Population[] }) => {
  const populations = props.props
  console.log(populations)

  const processPopulationData = (populations: Population[]) => {
    const result: ResultData[] = []
    const years = new Set<number>()

    // 年度のセットを作成
    populations.forEach((population) => {
      population.popData.forEach((data) => {
        years.add(data.year)
      })
    })

    // 年度ごとに人口データをまとめる
    years.forEach((year) => {
      const obj: ResultData = { year }
      populations.forEach((population) => {
        const item = population.popData.find((data) => data.year === year)
        obj[population.name] = item ? item.value : null
      })
      result.push(obj)
    })
    return result
  }

  const processedData = processPopulationData(populations)
  console.log('processData', processedData)

  return (
    <LineChart
      width={800}
      height={400}
      data={processedData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      {populations.map((pref) => (
        <Line
          key={pref.name}
          type="monotone"
          dataKey={pref.name}
          name={pref.name}
          stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
        />
      ))}
    </LineChart>
  )
}
