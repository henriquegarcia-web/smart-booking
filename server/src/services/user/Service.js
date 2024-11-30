import Professional from '../../models/Professional.js'
import Company from '../../models/Company.js'

export const handleGetProfessionalProfile = async (userId) => {
  const user = await Professional.findById(userId).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const handleGetCompanyProfile = async (userId) => {
  const user = await Company.findById(userId).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
