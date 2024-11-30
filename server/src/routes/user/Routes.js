import { Router } from 'express'
import {
  getProfessionalProfile,
  getCompanyProfile
} from '../../controllers/user/Controller.js'
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js'

const router = Router()

router.get('/profile-professional', AuthMiddleware, getProfessionalProfile)
router.get('/profile-company', AuthMiddleware, getCompanyProfile)

export default router
