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
    // Permite requisições de origem no ambiente local ou produção
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error(`Bloqueado pelo CORS: Origem não permitida => ${origin}`)
      callback(new Error('Bloqueado pelo CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permite envio de cookies/autenticação
  optionsSuccessStatus: 204 // Sem conteúdo para requisições OPTIONS
}

const app = express()

// Middleware de CORS
app.use(cors(corsOptions))

// Middleware para parsing de body (json e url-encoded)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
