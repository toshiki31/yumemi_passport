import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Accordion } from '../../components/accordion'
import { LabelContext, SetLabelContext } from '../../contexts/labelContext'

const renderWithProviders = (
  ui: JSX.Element,
  {
    label,
    setLabel,
  }: {
    label: string
    setLabel: React.Dispatch<React.SetStateAction<string>>
  }
) => {
  return render(
    <LabelContext.Provider value={label}>
      <SetLabelContext.Provider value={setLabel}>{ui}</SetLabelContext.Provider>
    </LabelContext.Provider>
  )
}

test('renders the accordion title', async () => {
  const label = ['総人口', '年少人口', '生産年齢人口', '老年人口']
  const setLabel = jest.fn()

  renderWithProviders(<Accordion />, {
    label: label[0],
    setLabel,
  })
  expect(screen.getByText('総人口')).toBeInTheDocument()

  renderWithProviders(<Accordion />, {
    label: label[1],
    setLabel,
  })
  expect(screen.getByText('年少人口')).toBeInTheDocument()
})
