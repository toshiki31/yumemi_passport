import React, { useState } from 'react'
interface Prefecture {
  prefCode: number
  prefName: string
  isChecked: boolean
}
export const PrefecturesContext = React.createContext<Prefecture[]>([])
export const SetPrefecturesContext = React.createContext<
  React.Dispatch<React.SetStateAction<Prefecture[]>>
>(() => undefined)

export const PrefecturesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  return (
    <PrefecturesContext.Provider value={prefectures}>
      <SetPrefecturesContext.Provider value={setPrefectures}>
        {children}
      </SetPrefecturesContext.Provider>
    </PrefecturesContext.Provider>
  )
}
