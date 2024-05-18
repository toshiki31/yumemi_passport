import React from 'react'
import { useEffect, useState } from 'react'
import '../assets/app.scss'
import { Header } from '../components/header'
import { getPrefectures } from '../services/apis/getPrefectures'

interface Prefecture {
  prefCode: number
  prefName: string
}

export default function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrefectures()
        console.log(data.result)
        setPrefectures(data.result)
      } catch (error) {
        console.error('Error fetching prefectures:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container">
      <Header />
      <div className="title">都道府県一覧</div>
      {/* <ul className="text">
        {prefectures.map((prefecture) => (
          <li key={prefecture.prefCode}>{prefecture.prefName}</li>
        ))}
      </ul> */}
      <div className="checkbox">
        {prefectures.map((prefecture) => (
          <div className="child_checkbox" key={prefecture.prefCode}>
            <input id={prefecture.prefName} type="checkbox" />
            <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
