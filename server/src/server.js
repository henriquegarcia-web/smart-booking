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
const corsOptions = {
  origin: (origin, callback) => {
    // Sempre permitir origens válidas ou nulas (para ferramentas de desenvolvimento como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error(`Bloqueado pelo CORS: Origem não permitida => ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Inclua OPTIONS
  credentials: true, // Habilite envio de credenciais
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Permita headers necessários
  exposedHeaders: ['Authorization'], // Exponha headers específicos, se necessário
  optionsSuccessStatus: 204
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

app.get('/test', (req, res) => {
  res.json({ message: 'Teste bem-sucedido! O servidor está funcionando.' })
})

app.use((err, req, res, next) => {
  if (err) {
    console.error('Erro detectado:', err.message)
    res.status(500).json({ error: 'Erro no servidor ou bloqueio do CORS.' })
  } else {
    next()
  }
})

export default app
