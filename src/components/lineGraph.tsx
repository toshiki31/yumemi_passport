import React, { useEffect, useState } from 'react'
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
import { Population, ResultData } from '../models/model'
import { useStrokeColor } from '../hooks/useStrokeColor'

export const LineGraph = (props: {
  info: {
    population: Population[]
    displayWidth: number
  }
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedData, setProcessedData] = useState<ResultData[]>([])
  const populations = props.info.population
  const displayWidth = props.info.displayWidth
  const strokeColor = useStrokeColor()

  useEffect(() => {
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
    if (populations.length > 0) {
      setIsLoading(true)
      const data = processPopulationData(populations)
      setProcessedData(data)
      setIsLoading(false)
    }
  }, [populations])

  return (
    <>
      {isLoading ? (
        <div
          className="graph"
          style={{ height: displayWidth * 0.4, width: displayWidth * 0.9 }}
        >
          <div className="loader"></div>
        </div>
      ) : (
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
          {populations.map((pref, index) => (
            <Line
              key={pref.name}
              type="monotone"
              dataKey={pref.name}
              name={pref.name}
              stroke={strokeColor(index)}
            />
          ))}
        </LineChart>
      )}
    </>
  )
}

export default LineGraph
