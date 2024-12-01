import { Router } from 'express'
import {
  registerUserAccess,
  registerUser,
  loginUser,
  verifyToken
} from '../controllers/AuthController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.post('/register-access', registerUserAccess)
router.post('/register', AuthMiddleware, registerUser)
router.post('/login', AuthMiddleware, loginUser)
router.get('/verify-token', AuthMiddleware, verifyToken)

export default router
