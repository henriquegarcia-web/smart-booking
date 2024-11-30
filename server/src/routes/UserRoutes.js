import { Router } from 'express'
import { getUserProfile } from '../controllers/UserController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/profile', AuthMiddleware, getUserProfile)

export default router
