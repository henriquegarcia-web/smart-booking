import User from '../models/User.js'

export const findById = async (userId) => {
  return User.findById(userId)
}

export const findByEmail = async (email) => {
  return User.findOne({ email })
}
