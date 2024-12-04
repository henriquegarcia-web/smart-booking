import { Router } from 'express'
import {
  findAccommodationsOnTravelXs,
  findAccommodationsOnConnectTravel
} from '../controllers/FilterController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/accommodations/travel-xs', findAccommodationsOnTravelXs)
router.get('/accommodations/connect-travel', findAccommodationsOnConnectTravel)

export default router
