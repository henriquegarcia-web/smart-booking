import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const connectDatabase = async () => {
  try {
    // await mongoose.connect(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    })
    console.log('Database conectada com sucesso')
  } catch (error) {
    console.error('Erro ao tentar se conectar à database:', error)
    throw error
  }
}
