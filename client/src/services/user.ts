import api from '@/lib/fetch'

const fetchUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/user/profile/${userId}`)
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

const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/user/delete/${userId}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

const toggleUserBlock = async (userId: string, blockStatus: boolean) => {
  try {
    const response = await api.put(`/user/block/${userId}`, { blockStatus })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export { fetchUserProfile, fetchUsersProfiles, deleteUser, toggleUserBlock }
