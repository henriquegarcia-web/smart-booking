import api from '@/lib/fetch'

const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/profile')
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const fetchUsersProfiles = async () => {
  try {
    const response = await api.get('/user/profiles')
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { fetchUserProfile, fetchUsersProfiles }
