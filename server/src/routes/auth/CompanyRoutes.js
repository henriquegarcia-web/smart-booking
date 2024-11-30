import { Router } from 'express'
import {
  registerCompany,
  loginCompany,
  verifyTokenCompany
} from '../../controllers/auth/CompanyController.js'

const router = Router()

router.post('/register', registerCompany)
router.post('/login', loginCompany)
router.get('/verify-token', verifyTokenCompany)

export default router
