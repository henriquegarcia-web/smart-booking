import api from '@/lib/fetch'

interface PaymentData {
  amount: number
}

const deposit = async (data: PaymentData) => {
  try {
    const response = await api.post('/payments/deposit', data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const withdraw = async (data: PaymentData) => {
  try {
    const response = await api.post('/payments/withdraw', data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { deposit, withdraw }
