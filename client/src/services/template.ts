import api from '@/lib/fetch'

const fetchTemplate = async (): Promise<boolean> => {
  try {
    const response = await api.get('/tremplate')
    const data = await response.data
    return !!data
  } catch (error) {
    console.log(error)
    return false
  }
}

export { fetchTemplate }
