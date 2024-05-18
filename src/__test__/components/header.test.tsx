import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Header from '../../components/header'

test('renders the header title', async () => {
  render(<Header />)
  expect(screen.getByText('都道府県の人口推移')).toBeInTheDocument()
})
