import app from './server.js'
import { connectDatabase } from './config/database.js'

const PORTA = process.env.PORT || 5000

connectDatabase()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Servidor ativo, portAa: ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Falha ao tentar se conectar a database', err)
  })

export default app
