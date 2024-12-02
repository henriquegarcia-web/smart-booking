import { Router } from 'express'
import {
  getUserProfile,
  getAllUsersProfile,
  deleteUser,
  toggleUserBlock
} from '../controllers/UserController.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js'

const router = Router()

router.get('/profile/:userId', getUserProfile)
router.get('/profiles', getAllUsersProfile)
router.delete('/delete/:userId', deleteUser)
router.put('/block/:userId', toggleUserBlock)

export default router
