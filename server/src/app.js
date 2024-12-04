// import express from 'express'
// import bodyParser from 'body-parser'
// import cors from 'cors'
// import routes from './routes/index.js'

// const allowedOrigins = [
//   'http://localhost:5173',
//   process.env.CLIENT_CORS_ALLOW_URL
// ]

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true)
//     } else {
//       callback(new Error('Bloqueado pelo CORS'))
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
//   optionsSuccessStatus: 200
// }

// const app = express()

// // CORS
// app.use(cors(corsOptions))

// // Middleware
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// // Routes
// app.use('/api', routes)

// app.get('/test', (req, res) => {
//   res.json({ message: 'Teste bem-sucedido! O servidor está funcionando.' })
// })

// export default app
