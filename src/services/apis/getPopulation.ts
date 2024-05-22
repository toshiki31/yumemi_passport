import axios from 'axios'

export const getPopulation = async (prefCode: number) => {
  try {
    const API_KEY = process.env.REACT_APP_RESAS_API_KEY
    const prefCodeUrl = prefCode
    // Check if the API key is set
    if (!API_KEY) {
      throw new Error('REACT_APP_RESAS_API_KEY is not set')
    }
    const response = await axios.get(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCodeUrl}`,
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
      }
    )
    const data = response.data
    return data
  } catch (error) {
    alert('データの取得に失敗しました')
    throw error
  }
}
