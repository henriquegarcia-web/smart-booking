import User from '../models/User.js'

export const handleGetUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const handleGetAllUsers = async () => {
  try {
    const users = await User.find().select('-password')
    if (users.length === 0) return []
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}
