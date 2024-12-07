import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/index.js'

const allowedOrigins = [
  'https://vmcot-client.vercel.app',
  'http://vmcot-client.vercel.app',
  'https://18.118.128.178',
  'http://18.118.128.178',
  'http://localhost:5173',
  process.env.CLIENT_CORS_ALLOW_URL
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error(`Bloqueado pelo CORS: Origem não permitida => ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 204
}

const app = express()

// Middleware de CORS
app.use(cors(corsOptions))

// Middleware para parsing de body (json e url-encoded)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Definição de rotas
app.use('/api', routes)

app.get('/api/test', (req, res) => {
  res.json({ message: 'Teste bem-sucedido! O servidor está funcionando.' })
})

export default app
