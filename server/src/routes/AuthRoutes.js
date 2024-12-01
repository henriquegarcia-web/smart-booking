import { Router } from 'express'
import {
  registerUserAccess,
  registerUser,
  loginUser,
  verifyToken
} from '../controllers/AuthController.js'

const router = Router()

router.post('/register-access', registerUserAccess)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify-token', verifyToken)

export default router
