import app from './server.js'
import { connectDatabase } from './config/database.js'

const PORT = process.env.PORT || 5000

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ativo, porta: ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Falha ao tentar se conectar a database', err)
  })

export default app
