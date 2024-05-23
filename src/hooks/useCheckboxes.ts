import { useContext } from 'react'
import {
  PrefecturesContext,
  SetPrefecturesContext,
} from '../contexts/prefectureContext'
import {
  PopulationContext,
  SetPopulationContext,
} from '../contexts/populationContext'
import { Prefecture } from '../models/model'

export const useHandleChanged = () => {
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
  return handleChanged
}
