export interface Prefecture {
  prefCode: number
  prefName: string
  isChecked: boolean
}
export interface Population {
  name: string
  popData: {
    year: number
    value: number
  }[]
}

export interface ResultData {
  year: number
  [key: string]: number | null
}
