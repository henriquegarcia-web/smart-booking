import dotenv from 'dotenv'

dotenv.config()

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '1h'
}
