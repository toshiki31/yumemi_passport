import React from 'react'
import { useEffect, useState } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'
import { getPopulation } from '../services/apis/getPopulation'
import { LineGraph } from '../components/lineGraph'

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

  const fetchPopulationData = async (checkedPref: Prefecture) => {
    try {
      const responseData = await getPopulation(checkedPref.prefCode)
      console.log(responseData)

      // データ整形処理
      {
        /** todo: 他の人口との切り替え処理 */
      }
      const populationData = responseData.result.data[0].data
      console.log(populationData)
      const newPopulation: Population = {
        name: checkedPref.prefName,
        popData: populationData,
      }
      console.log(newPopulation)
      setPopulation([...populations, newPopulation])
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
      fetchPopulationData(prefecture)
    } else {
      handleIsChecked(prefecture)
      {
        /* todo: populationからデータを外す処理 */
      }
    }
  }

  return (
    <div className="container">
      <Header />
      <h2 className="title">都道府県一覧</h2>
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
      <div>
        <h2 className="title">人口推移</h2>
        <LineGraph props={populations} />
      </div>
    </div>
  )
}
