import api from '@/lib/fetch'

interface RegisterAccessData {
  email: string
  role: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

const registerAccess = async (userData: RegisterAccessData) => {
  try {
    const response = await api.post('/auth/register-access', userData)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const register = async (userData: RegisterData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const login = async (credentials: LoginData) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const verifyToken = async (token: string) => {
  try {
    const response = await api.get('/auth/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { registerAccess, register, login, verifyToken }
