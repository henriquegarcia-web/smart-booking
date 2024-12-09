import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import routes from './routes/index.js'

const allowedOrigins = [
  'https://vmcot-client.vercel.app',
  'http://vmcot-client.vercel.app',
  'https://18.118.128.178',
  'http://18.118.128.178',
  'http://localhost:5173',
  process.env.CLIENT_CORS_ALLOW_URL,
  process.env.CLIENT_CORS_ALLOW_URL_1,
  process.env.CLIENT_CORS_ALLOW_URL_2
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

// const app = express()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: corsOptions
})

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

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Um cliente se conectou')

  socket.on('requestOTP', (callback) => {
    console.log('Solicitação de OTP recebida')
    socket.emit('enterOTP')
    console.log('Evento enterOTP emitido')
  })

  // socket.on('requestOTP', (callback) => {
  //   // Emite um evento para o cliente solicitando o código OTP
  //   socket.emit('enterOTP')
  // })

  socket.on('submitOTP', (otp) => {
    // Armazena o OTP recebido
    socket.otp = otp
  })
})

export { app, server, io }
