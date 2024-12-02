import { Router } from 'express'
import { findAccommodations } from '../controllers/FilterController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/accommodations', findAccommodations)

export default router
