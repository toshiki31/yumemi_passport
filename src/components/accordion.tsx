import React from 'react'
import { useEffect, useContext } from 'react'
import '../assets/app.scss'
import { getPopulation } from '../services/apis/getPopulation'
import { LabelContext } from '../contexts/labelContext'
import { PrefecturesContext } from '../contexts/prefectureContext'
import { SetPopulationContext } from '../contexts/populationContext'
import { Population } from '../models/model'
import { useAccordion } from '../hooks/useAccordion'

export const Accordion = () => {
  const setPopulation = useContext(SetPopulationContext)
  const label = useContext(LabelContext)
  const prefectures = useContext(PrefecturesContext)
  const selectList = ['総人口', '年少人口', '生産年齢人口', '老年人口']
  const { isOpen, handleLabelChange, toggleAction } = useAccordion()

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
  }, [label])

  return (
    <div className="accordion_container">
      <div className="accordion_summary" onClick={toggleAction}>
        <span className="accordion_text">{label}</span>
        <span className={`accordion_icon ${isOpen ? 'open' : ''}`}></span>
      </div>
      {isOpen && (
        <div className="accordion_details">
          {selectList.map(
            (item, index) =>
              item !== label && (
                <div
                  key={index}
                  className="accordion_item"
                  onClick={() => handleLabelChange(item)}
                >
                  {item}
                </div>
              )
          )}
        </div>
      )}
    </div>
  )
}

export default Accordion
