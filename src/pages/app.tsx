import React from 'react'
import { useEffect, useState } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'
import { getPopulation } from '../services/apis/getPopulation'
import { LineGraph } from '../components/lineGraph'
import { Accordion } from '../components/accordion'

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
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [populations, setPopulation] = useState<Population[]>([])
  const [label, setLabel] = useState<string>('総人口')
  const [displayWidth, setDisplayWidth] = useState<number>(window.innerWidth)

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
        console.error('Error fetching prefectures:', error)
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
          console.error(
            'Error fetching population from the checked prefecture:',
            error
          )
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

  /** チェックボックスのチェックを変更する */
  const handleIsChecked = (checkedPref: Prefecture) => {
    const newPrefectures = prefectures.map((prefecture) => {
      if (prefecture.prefCode === checkedPref.prefCode) {
        return {
          ...prefecture,
          isChecked: !prefecture.isChecked,
        }
      }
      return prefecture
    })
    setPrefectures(newPrefectures)
  }

  /** チェックボタンを押した時の処理全体 */
  const handleChanged = (prefecture: Prefecture) => {
    if (!prefecture.isChecked) {
      handleIsChecked(prefecture)
    } else {
      handleIsChecked(prefecture)
      /** チェックを外す処理 */
      const deletePrefecture = populations.findIndex(
        (population) => population.name === prefecture.prefName
      )
      if (deletePrefecture === -1) {
        return
      }
      populations.splice(deletePrefecture, 1)
      setPopulation([...populations])
    }
  }

  return (
    <div className="container">
      <Header />
      <h2>都道府県一覧</h2>
      <div className="checkbox">
        {prefectures.map((prefecture) => (
          <div className="child_checkbox" key={prefecture.prefCode}>
            <input
              id={prefecture.prefName}
              checked={prefecture.isChecked}
              onChange={() => handleChanged(prefecture)}
              type="checkbox"
            />

            <label htmlFor={prefecture.prefName} className="custom_checkbox">
              {prefecture.prefName}
            </label>
          </div>
        ))}
      </div>
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
