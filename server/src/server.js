import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import routes from './routes/index.js'

const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_CORS_ALLOW_URL
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Bloqueado pelo CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
}

const app = express()

// CORS
app.use(cors(corsOptions))

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

export default app

// connectDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Servidor ativo, porta: ${PORT}`)
//     })
//   })
//   .catch((err) => {
//     console.error('Falha ao tentar se conectar a database', err)
//   })
