import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/index.js'

const allowedOrigins = [
  'https://vmcot-client.vercel.app', // Produção
  'http://localhost:5173', // Localhost
  process.env.CLIENT_CORS_ALLOW_URL // Outras URLs dinâmicas
]

// Configuração do CORS
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Sempre permitir origens válidas ou nulas (para ferramentas de desenvolvimento como Postman)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true)
//     } else {
//       console.error(`Bloqueado pelo CORS: Origem não permitida => ${origin}`)
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Inclua OPTIONS
//   credentials: true, // Habilite envio de credenciais
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Permita headers necessários
//   exposedHeaders: ['Authorization'], // Exponha headers específicos, se necessário
//   optionsSuccessStatus: 204
// }
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir origens específicas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error(`Bloqueado pelo CORS: Origem não permitida => ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos permitidos
  credentials: true, // Permitir envio de cookies/autenticação
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token'
  ], // Cabeçalhos permitidos
  exposedHeaders: ['Authorization'], // Cabeçalhos que podem ser expostos ao cliente
  optionsSuccessStatus: 204 // Resposta rápida para OPTIONS
}

const app = express()

// Middleware de CORS
app.use(cors(corsOptions))

// Middleware para parsing de body (json e url-encoded)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // Permita todas as origens (ou configure especificamente)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204) // Responda rapidamente para requisições preflight
  } else {
    next()
  }
})

// Definição de rotas
app.use('/api', routes)

// app.use((req, res, next) => {
//   res.setTimeout(10000, () => {
//     // Timeout de 10 segundos
//     res.status(408).json({ error: 'Request timeout' })
//   })
//   next()
// })

app.get('/test', (req, res) => {
  res.json({ message: 'Teste bem-sucedido! O servidor está funcionando.' })
})

// app.use((err, req, res, next) => {
//   if (err) {
//     console.error('Erro detectado:', err.message)
//     res.status(500).json({ error: 'Erro no servidor ou bloqueio do CORS.' })
//   } else {
//     next()
//   }
// })

export default app
