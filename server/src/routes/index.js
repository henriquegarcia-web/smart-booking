import { Router } from 'express'
import authProfessionalRoutes from './auth/ProfessionalRoutes.js'
import authCompanyRoutes from './auth/CompanyRoutes.js'
import userRoutes from './user/Routes.js'

const router = Router()

router.use('/auth/professional', authProfessionalRoutes)
router.use('/auth/company', authCompanyRoutes)
router.use('/user', userRoutes)

export default router
