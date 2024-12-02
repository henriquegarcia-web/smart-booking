import { Router } from 'express'
import {
  findAccommodationsOnTravelXs,
  findAccommodationsOnConnectTravel
} from '../controllers/FilterController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/accommodations1', findAccommodationsOnTravelXs)
router.get('/accommodations2', findAccommodationsOnConnectTravel)

export default router
