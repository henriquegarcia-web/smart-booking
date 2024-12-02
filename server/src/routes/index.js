import { Router } from 'express'
import authRoutes from './AuthRoutes.js'
import userRoutes from './UserRoutes.js'
import filterRoutes from './FilterRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/filter', filterRoutes)

export default router
