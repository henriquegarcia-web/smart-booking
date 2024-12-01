import jwt from 'jsonwebtoken'
import {
  handleRegisterUserAccess,
  handleRegisterUser,
  handleLoginUser,
  handleGetUserById
} from '../services/AuthService.js'
import { authConfig } from '../config/auth.js'

export const registerUserAccess = async (req, res) => {
  const { email, role } = req.body

  try {
    const registerResponse = await handleRegisterUserAccess({
      email,
      role
    })
    res.status(201).json(registerResponse)
  } catch (error) {
    res.status(400).json({
      code: error.code || 'REGISTRATION_FAILED',
      message: error.message || 'Falha no registro do usuário'
    })
  }
}

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const registerResponse = await handleRegisterUser({
      name,
      email,
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

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const loginResponse = await handleLoginUser({ email, password })
    res.status(200).json(loginResponse)
  } catch (error) {
    res.status(401).json({
      code: error.code || 'LOGIN_FAILED',
      message: error.message || 'Falha no login, email ou senha inválidos'
    })
  }
}

export const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ code: 'ACCESS_DENIED', message: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret)
    const user = await handleGetUserById(decoded.id)
    if (!user) {
      return res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      blocked: user.blocked,
      firstAccess: user.firstAccess,
      role: user.role
    })
  } catch (error) {
    res.status(400).json({ code: 'INVALID_TOKEN', message: 'Token inválido' })
  }
}
