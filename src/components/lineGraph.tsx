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
import '../assets/app.scss'

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

export const LineGraph = (props: {
  info: {
    population: Population[]
    displayWidth: number
  }
}) => {
  const populations = props.info.population
  const displayWidth = props.info.displayWidth
  const processPopulationData = (populations: Population[]) => {
    const result: ResultData[] = []
    const years = new Set<number>()

    /** 年度のセットを作成 */
    populations.forEach((population) => {
      population.popData.forEach((data) => {
        years.add(data.year)
      })
    })

    /** 年度ごとに人口データをまとめる */
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

  return (
    <LineChart
      className="graph"
      data={processedData}
      height={displayWidth * 0.4}
      width={displayWidth * 0.9}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend verticalAlign="top" />
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

export default LineGraph
