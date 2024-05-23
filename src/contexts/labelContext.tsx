import React, { useState } from 'react'

export const LabelContext = React.createContext<string>('総人口')
export const SetLabelContext = React.createContext<
  React.Dispatch<React.SetStateAction<string>>
>(() => undefined)
export const LabelProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [label, setLabel] = useState<string>('総人口')
  return (
    <LabelContext.Provider value={label}>
      <SetLabelContext.Provider value={setLabel}>
        {children}
      </SetLabelContext.Provider>
    </LabelContext.Provider>
  )
}
