import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authConfig } from '../config/auth.js'

class AuthError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export const handleRegisterUserAccess = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new AuthError('USER_EXISTS', 'Email já está em uso.')
    }

    const user = new User({ ...userData })
    await user.save()

    return { user }
  } catch (error) {
    if (error.code === 11000) {
      throw new AuthError('USER_EXISTS', 'Email já está em uso.')
    }
    throw new AuthError('REGISTRATION_ERROR', 'Erro ao registrar usuário')
  }
}

export const handleRegisterUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ email: userData.email })
    if (!existingUser) {
      throw new AuthError('USER_NOT_APROVED', 'Email não está aprovado.')
    }

    console.log(existingUser)

    if (!existingUser.firstAccess) {
      throw new AuthError('USER_EXISTS', 'Usuário já cadastrado.')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new User({
      ...userData,
      firstAccess: false,
      password: hashedPassword
    })
    await user.save()

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    )

    return { user, token }
  } catch (error) {
    throw new AuthError('REGISTRATION_ERROR', 'Erro ao registrar usuário')
  }
}

export const handleLoginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AuthError('USER_NOT_FOUND', 'Usuário não encontrado')
  }

  if (user.firstAccess) {
    throw new AuthError(
      'USER_FIRST_ACCESS',
      'Esse é seu primeiro acesso, selecione o marcador "Primeiro Acesso"'
    )
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new AuthError('INVALID_PASSWORD', 'Senha inválida')
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  )

  return { user, token }
}

export const handleGetUserById = async (userId) => {
  return User.findById(userId).select('-password')
}
