import axios from 'axios'

export const getPrefectures = async () => {
  try {
    const response = await axios.get(
      'https://opendata.resas-portal.go.jp/api/v1/prefectures',
      {
        headers: {
          'X-API-KEY': process.env.REACT_APP_RESAS_API_KEY,
        },
      }
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching prefectures:', error)
    throw error
  }
}
