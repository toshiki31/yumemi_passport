import React from 'react'
import { useEffect, useState, useContext } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'
import { LineGraph } from '../components/lineGraph'
import { Accordion } from '../components/accordion'
import { Checkboxes } from '../components/checkboxes'
import { SetPrefecturesContext } from '../contexts/prefectureContext'
import { PopulationContext } from '../contexts/populationContext'
import { Prefecture } from '../models/model'

export default function App() {
  const populations = useContext(PopulationContext)
  const [displayWidth, setDisplayWidth] = useState<number>(
    document.documentElement.clientWidth
  )
  const scrollHeight = document.documentElement.scrollHeight
  const setPrefectures = useContext(SetPrefecturesContext)

  /** 初回レンダリング時 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrefectures()
        if (data && data.result) {
          /** チェックボックスの初期設定 */
          const initialPrefectures = data.result.map(
            (prefecture: Prefecture) => ({
              ...prefecture,
              isChecked: false,
            })
          )
          setPrefectures(initialPrefectures)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        alert('データの取得に失敗しました')
      }
    }
    fetchData()
    setDisplayWidth(document.documentElement.clientWidth)
  }, [])

  return (
    <div className="container" style={{ height: scrollHeight }}>
      <Header />
      <h2>都道府県一覧</h2>
      <Checkboxes />
      <div className="population">
        <h2>人口推移</h2>
        <Accordion />
        <LineGraph
          info={{ population: populations, displayWidth: displayWidth }}
        />
      </div>
    </div>
  )
}
