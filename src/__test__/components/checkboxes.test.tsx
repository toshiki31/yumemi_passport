import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Checkboxes } from '../../components/checkboxes'
import { Prefecture } from '../../models/model'
import {
  PrefecturesContext,
  SetPrefecturesContext,
} from '../../contexts/prefectureContext'
import { getPrefectures } from '../../services/apis/getPrefectures'

jest.mock('../../services/apis/getPrefectures')

const mockGetPrefectures = getPrefectures as jest.MockedFunction<
  typeof getPrefectures
>

const renderWithProviders = (
  ui: JSX.Element,
  {
    prefectures,
    setPrefectures,
  }: {
    prefectures: Prefecture[]
    setPrefectures: React.Dispatch<React.SetStateAction<Prefecture[]>>
  }
) => {
  return render(
    <PrefecturesContext.Provider value={prefectures}>
      <SetPrefecturesContext.Provider value={setPrefectures}>
        {ui}
      </SetPrefecturesContext.Provider>
    </PrefecturesContext.Provider>
  )
}

describe('Checkboxes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fetches and displays the checkboxes', async () => {
    const mockPrefectures = [
      {
        prefCode: 1,
        prefName: '北海道',
        isChecked: false,
      },
      {
        prefCode: 2,
        prefName: '青森県',
        isChecked: false,
      },
    ]
    const setPrefectures = jest.fn()

    mockGetPrefectures.mockResolvedValue({ result: mockPrefectures })

    renderWithProviders(<Checkboxes />, {
      prefectures: mockPrefectures,
      setPrefectures,
    })

    await waitFor(() => {
      const hokkaidoCheckbox = screen.getByLabelText(
        '北海道'
      ) as HTMLInputElement
      const aomoriCheckbox = screen.getByLabelText('青森県') as HTMLInputElement

      expect(hokkaidoCheckbox).toBeInTheDocument()
      expect(aomoriCheckbox).toBeInTheDocument()

      // デフォルトはチェックされていない
      expect(hokkaidoCheckbox.checked).toBe(false)
      expect(aomoriCheckbox.checked).toBe(false)
    })
  })

  test('toggles the checkbox state when clicked', async () => {
    const mockPrefectures = [
      {
        prefCode: 1,
        prefName: '北海道',
        isChecked: false,
      },
      {
        prefCode: 2,
        prefName: '青森県',
        isChecked: false,
      },
    ]
    const setPrefectures = jest.fn()

    mockGetPrefectures.mockResolvedValue({ result: mockPrefectures })

    renderWithProviders(<Checkboxes />, {
      prefectures: mockPrefectures,
      setPrefectures,
    })

    fireEvent.click(screen.getByLabelText('北海道'))
    await waitFor(() => {
      expect(setPrefectures).toHaveBeenCalledWith([
        { prefCode: 1, prefName: '北海道', isChecked: true },
        { prefCode: 2, prefName: '青森県', isChecked: false },
      ])

      fireEvent.click(screen.getByLabelText('青森県'))
      waitFor(() => {
        expect(setPrefectures).toHaveBeenCalledWith([
          { prefCode: 1, prefName: '北海道', isChecked: true },
          { prefCode: 2, prefName: '青森県', isChecked: true },
        ])
      })
    })
  })
})
