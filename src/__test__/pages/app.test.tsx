import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from '../../pages/app'
import { getPrefectures } from '../../services/apis/getPrefectures'

jest.mock('../../services/apis/getPrefectures')

const mockGetPrefectures = getPrefectures as jest.MockedFunction<
  typeof getPrefectures
>

test('renders the header and title', async () => {
  render(<App />)
  expect(screen.getByText('都道府県一覧')).toBeInTheDocument()
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

  render(<App />)
  await waitFor(() => {
    expect(screen.getByText('北海道')).toBeInTheDocument()
    expect(screen.getByText('青森県')).toBeInTheDocument()
  })
})

{
  /* todo: エラー時のテスト */
}
test('does not display prefectures when an error occurs', async () => {
  mockGetPrefectures.mockRejectedValue(new Error('Error fetching prefectures'))
  const alertMock = jest.spyOn(window, 'alert').mockImplementation()

  render(<App />)
  await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith('データの取得に失敗しました')

    expect(screen.queryByText('北海道')).not.toBeInTheDocument()
    expect(screen.queryByText('青森県')).not.toBeInTheDocument()
  })
})

test('renders checkboxes', async () => {
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

  render(<App />)
  await waitFor(() => {
    const hokkaidoCheckbox = screen.getByLabelText('北海道') as HTMLInputElement
    const aomoriCheckbox = screen.getByLabelText('青森県') as HTMLInputElement

    expect(hokkaidoCheckbox).toBeInTheDocument()
    expect(aomoriCheckbox).toBeInTheDocument()

    // デフォルトはチェックされていない
    expect(hokkaidoCheckbox.checked).toBe(false)
    expect(aomoriCheckbox.checked).toBe(false)

    // チェックボックスをクリックするとチェックされる
    fireEvent.click(hokkaidoCheckbox)
    expect(hokkaidoCheckbox.checked).toBe(true)

    fireEvent.click(aomoriCheckbox)
    expect(aomoriCheckbox.checked).toBe(true)

    // チェックボックスを再度クリックするとチェックが外れる
    fireEvent.click(hokkaidoCheckbox)
    expect(hokkaidoCheckbox.checked).toBe(false)

    fireEvent.click(aomoriCheckbox)
    expect(aomoriCheckbox.checked).toBe(false)
  })
})

test('does not fetches and displays population data', async () => {
  mockGetPrefectures.mockRejectedValue(new Error('Error fetching prefectures'))
  const alertMock = jest.spyOn(window, 'alert').mockImplementation()

  render(<App />)
  await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith(
      'チェックされた県のデータ取得に失敗しました'
    )
  })
})
