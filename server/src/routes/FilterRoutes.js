import { Router } from 'express'
import { findAccommodationsOnTravelXs } from '../controllers/Filter/TravelXsController.js'
import { findAccommodationsOnConnectTravel } from '../controllers/Filter/ConnectTravelController.js'
import { findAccommodations } from '../controllers/FilterController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/accommodations/travel-xs', findAccommodationsOnTravelXs)
router.get('/accommodations/connect-travel', findAccommodationsOnConnectTravel)
router.get('/accommodations', findAccommodations)

export default router

/**
 

  - Implementar funções assincronas de execução, mas retorna
    quando todas estiverem prontas
  - Colocar uma awaitforselector de forma otimizada no código e
    ver se resolve

 */
