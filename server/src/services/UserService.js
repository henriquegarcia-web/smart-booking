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

export const handleDeleteUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId)
    console.log(deletedUser)
    if (!deletedUser) {
      throw new Error('User not found')
    }
    return deletedUser
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}

export const handleToggleUserBlock = async (userId, blockStatus) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: blockStatus },
      { new: true }
    ).select('-password')
    if (!updatedUser) {
      throw new Error('User not found')
    }
    return updatedUser
  } catch (error) {
    console.error('Error toggling user block status:', error)
    throw new Error('Failed to toggle user block status')
  }
}
