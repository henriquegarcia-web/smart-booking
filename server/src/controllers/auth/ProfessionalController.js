import {
  handleRegisterProfessional,
  handleLoginProfessional,
  handleGetProfessionalById
} from '../../services/auth/ProfessionalService.js'
import jwt from 'jsonwebtoken'
import { authConfig } from '../../config/auth.js'

export const registerProfessional = async (req, res) => {
  const { name, cpf, phone, email, pixKey, password } = req.body

  try {
    const registerResponse = await handleRegisterProfessional({
      name,
      cpf,
      phone,
      email,
      pixKey,
      password
    })
    res.status(201).json(registerResponse)
  } catch (error) {
    res.status(400).json({
      code: error.code || 'REGISTRATION_FAILED',
      message: error.message || 'Falha no registro do usuário'
    })
  }
}

export const loginProfessional = async (req, res) => {
  const { email, password } = req.body

  try {
    const loginResponse = await handleLoginProfessional({ email, password })
    res.status(200).json(loginResponse)
  } catch (error) {
    res.status(401).json({
      code: error.code || 'LOGIN_FAILED',
      message: error.message || 'Falha no login, email ou senha inválidos'
    })
  }
}

export const verifyTokenProfessional = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ code: 'ACCESS_DENIED', message: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret)
    const user = await handleGetProfessionalById(decoded.id)
    if (!user) {
      return res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
    }
    res
      .status(200)
      .json({ userId: user._id, email: user.email, name: user.name })
  } catch (error) {
    res.status(400).json({ code: 'INVALID_TOKEN', message: 'Token inválido' })
  }
}
