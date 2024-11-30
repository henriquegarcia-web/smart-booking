import api from '@/lib/fetch'

const fetchAllBoxes = async () => {
  try {
    const response = await api.get('/boxes')
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const openBox = async (boxId: string) => {
  try {
    const response = await api.post(`/boxes/${boxId}/open`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { fetchAllBoxes, openBox }
