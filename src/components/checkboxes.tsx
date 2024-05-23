import React from 'react'
import { useEffect, useContext } from 'react'
import { LabelContext } from '../contexts/labelContext'
import {
  PrefecturesContext,
  SetPrefecturesContext,
} from '../contexts/prefectureContext'
import {
  PopulationContext,
  SetPopulationContext,
} from '../contexts/populationContext'
import { getPopulation } from '../services/apis/getPopulation'
import { Prefecture, Population } from '../models/model'

export const Checkboxes = () => {
  const label = useContext(LabelContext)
  const prefectures = useContext(PrefecturesContext)
  const setPrefectures = useContext(SetPrefecturesContext)
  const populations = useContext(PopulationContext)
  const setPopulation = useContext(SetPopulationContext)

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
    handleIsChecked(prefecture)
    if (prefecture.isChecked) {
      const deletePrefecture = populations.findIndex(
        (population) => population.name === prefecture.prefName
      )
      if (deletePrefecture !== -1) {
        const newPopulations = [...populations]
        newPopulations.splice(deletePrefecture, 1)
        setPopulation(newPopulations)
      }
    }
  }

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
          alert('チェックされた県の人口データ取得に失敗しました')
        }
      }
      setPopulation(newPopulations)
    }
    fetchPopulationData()
  }, [prefectures])

  return (
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
  )
}
