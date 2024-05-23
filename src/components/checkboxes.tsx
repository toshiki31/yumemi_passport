import React from 'react'
import { useEffect, useContext } from 'react'
import { LabelContext } from '../contexts/labelContext'
import { PrefecturesContext } from '../contexts/prefectureContext'
import { SetPopulationContext } from '../contexts/populationContext'
import { getPopulation } from '../services/apis/getPopulation'
import { Population } from '../models/model'
import { useHandleChanged } from '../hooks/useCheckboxes'

export const Checkboxes = () => {
  const label = useContext(LabelContext)
  const prefectures = useContext(PrefecturesContext)
  const setPopulation = useContext(SetPopulationContext)
  const handleChanged = useHandleChanged()

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

export default Checkboxes
