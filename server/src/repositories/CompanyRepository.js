import Company from '../models/Company.js'

export const findById = async (userId) => {
  return Company.findById(userId)
}

export const findByEmail = async (email) => {
  return Company.findOne({ email })
}
