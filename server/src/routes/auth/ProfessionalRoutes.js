import { Router } from 'express'
import {
  registerProfessional,
  loginProfessional,
  verifyTokenProfessional
} from '../../controllers/auth/ProfessionalController.js'

const router = Router()

router.post('/register', registerProfessional)
router.post('/login', loginProfessional)
router.get('/verify-token', verifyTokenProfessional)

export default router
