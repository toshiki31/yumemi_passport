import React from 'react'
import { useEffect, useState, useContext } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'
import { getPopulation } from '../services/apis/getPopulation'
import { LineGraph } from '../components/lineGraph'
import { Accordion } from '../components/accordion'
import { Checkboxes } from '../components/checkboxes'
import { LabelContext, SetLabelContext } from '../contexts/labelContext'
import {
  PrefecturesContext,
  SetPrefecturesContext,
} from '../contexts/prefectureContext'
interface Prefecture {
  prefCode: number
  prefName: string
  isChecked: boolean
}

interface Population {
  name: string
  popData: {
    year: number
    value: number
  }[]
}

export default function App() {
  const [populations, setPopulation] = useState<Population[]>([])
  const [displayWidth, setDisplayWidth] = useState<number>(window.innerWidth)
  const label = useContext(LabelContext)
  const setLabel = useContext(SetLabelContext)
  const prefectures = useContext(PrefecturesContext)
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
          console.log(initialPrefectures)
          setPrefectures(initialPrefectures)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        alert('データの取得に失敗しました')
      }
    }
    fetchData()
    setDisplayWidth(window.innerWidth)
  }, [])

  /** ラベルと一致したデータをフェッチする  */
  useEffect(() => {
    const fetchPopulationData = async () => {
      /** チェックがついていた県はつけたままにする */
      const checkedPrefectures = prefectures.filter((pref) => pref.isChecked)
      const newPopulations: Population[] = []

      /** ラベルと同じ名前のデータを取得 */
      for (const checkedPref of checkedPrefectures) {
        try {
          const responseData = await getPopulation(checkedPref.prefCode)
          const populationData = responseData.result.data.find(
            (item: { label: string }) => item.label === label
          )?.data

          const newPopulation: Population = {
            name: checkedPref.prefName,
            popData: populationData,
          }
          newPopulations.push(newPopulation)
        } catch (error) {
          alert('チェックされた県のデータ取得に失敗しました')
        }
      }
      setPopulation(newPopulations)
    }
    fetchPopulationData()
  }, [label, prefectures])

  /** ラベル変更時 */
  const handleSelect = (label: string) => {
    setLabel(label)
  }
  return (
    <div className="container">
      <Header />
      <h2>都道府県一覧</h2>
      <Checkboxes />
      <div className="population">
        <h2>人口推移</h2>
        <Accordion props={{ selectItem: label, handleSelect: handleSelect }} />
        <LineGraph
          info={{ population: populations, displayWidth: displayWidth }}
        />
      </div>
    </div>
  )
}
