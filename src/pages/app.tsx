import React from 'react'
import { useEffect, useState } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'
import { getPopulation } from '../services/apis/getPopulation'

interface Prefecture {
  prefCode: number
  prefName: string
  isChecked: boolean
}

export default function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrefectures()
        if (data && data.result) {
          // チェックボックスの初期設定
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
  }, [])

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

  const fetchPopulationData = async (prefCode: number) => {
    try {
      const populationData = await getPopulation(prefCode)
      console.log(populationData)
    } catch (error) {
      console.error(
        'Error fetching population from the checked prefecture:',
        error
      )
    }
  }

  const handleChanged = (prefecture: Prefecture) => {
    console.log(prefecture)
    if (!prefecture.isChecked) {
      handleIsChecked(prefecture)
      fetchPopulationData(prefecture.prefCode)
    } else {
      handleIsChecked(prefecture)
    }
  }

  return (
    <div className="container">
      <Header />
      <div className="title">都道府県一覧</div>
      <div className="checkbox">
        {prefectures.map((prefecture) => (
          <div className="child_checkbox" key={prefecture.prefCode}>
            <input
              id={prefecture.prefName}
              checked={prefecture.isChecked}
              onChange={() => handleChanged(prefecture)}
              type="checkbox"
            />
            <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
