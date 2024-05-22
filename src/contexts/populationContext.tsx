import React, { useState } from 'react'
import { Population } from '../models/model'

export const PopulationContext = React.createContext<Population[]>([])
export const SetPopulationContext = React.createContext<
  React.Dispatch<React.SetStateAction<Population[]>>
>(() => undefined)
export const PopulationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [populations, setPopulation] = useState<Population[]>([])
  return (
    <PopulationContext.Provider value={populations}>
      <SetPopulationContext.Provider value={setPopulation}>
        {children}
      </SetPopulationContext.Provider>
    </PopulationContext.Provider>
  )
}
