import { Router } from 'express'
import {
  getUserProfile,
  getAllUsersProfile
} from '../controllers/UserController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/profile', AuthMiddleware, getUserProfile)
router.get('/profiles', getAllUsersProfile)

export default router
