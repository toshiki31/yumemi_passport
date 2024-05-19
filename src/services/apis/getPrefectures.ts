import axios from 'axios'

export const getPrefectures = async () => {
  try {
    const API_KEY = process.env.REACT_APP_RESAS_API_KEY
    // Check if the API key is set
    if (!API_KEY) {
      throw new Error('REACT_APP_RESAS_API_KEY is not set')
    }
    const response = await axios.get(
      'https://opendata.resas-portal.go.jp/api/v1/prefectures',
      {
        headers: {
          'X-API-KEY': API_KEY,
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
