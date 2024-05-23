import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from '../../pages/app'
import { getPrefectures } from '../../services/apis/getPrefectures'
import { PrefecturesProvider } from '../../contexts/prefectureContext'
import { LabelProvider } from '../../contexts/labelContext'
import { PopulationProvider } from '../../contexts/populationContext'

jest.mock('../../services/apis/getPrefectures')

const mockGetPrefectures = getPrefectures as jest.MockedFunction<
  typeof getPrefectures
>

test('renders the header and title', async () => {
  render(
    <PrefecturesProvider>
      <LabelProvider>
        <PopulationProvider>
          <App />
        </PopulationProvider>
      </LabelProvider>
    </PrefecturesProvider>
  )
  expect(screen.getByText('都道府県一覧')).toBeInTheDocument()
  expect(screen.getByText('人口推移')).toBeInTheDocument()
})

test('fetches and displays prefectures', async () => {
  const mockPrefectures = {
    message: null,
    result: [
      {
        prefCode: 1,
        prefName: '北海道',
      },
      {
        prefCode: 2,
        prefName: '青森県',
      },
    ],
  }

  mockGetPrefectures.mockResolvedValue(mockPrefectures)

  render(
    <PrefecturesProvider>
      <LabelProvider>
        <PopulationProvider>
          <App />
        </PopulationProvider>
      </LabelProvider>
    </PrefecturesProvider>
  )
  await waitFor(() => {
    expect(screen.getByText('北海道')).toBeInTheDocument()
    expect(screen.getByText('青森県')).toBeInTheDocument()
  })
})

/** エラー時のテスト */
test('does not display prefectures when an error occurs', async () => {
  mockGetPrefectures.mockRejectedValue(new Error('Error fetching prefectures'))
  const alertMock = jest.spyOn(window, 'alert').mockImplementation()

  render(
    <PrefecturesProvider>
      <LabelProvider>
        <PopulationProvider>
          <App />
        </PopulationProvider>
      </LabelProvider>
    </PrefecturesProvider>
  )
  await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith('データの取得に失敗しました')

    expect(screen.queryByText('北海道')).not.toBeInTheDocument()
    expect(screen.queryByText('青森県')).not.toBeInTheDocument()
  })
  alertMock.mockRestore()
})
