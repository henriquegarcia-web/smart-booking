import Professional from '../models/Professional.js'

export const findById = async (userId) => {
  return Professional.findById(userId)
}

export const findByEmail = async (email) => {
  return Professional.findOne({ email })
}
