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

    if (!existingUser.firstAccess) {
      throw new AuthError('USER_EXISTS', 'Usuário já cadastrado.')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const updatedUser = await User.findOneAndUpdate(
      { email: userData.email },
      {
        ...userData,
        firstAccess: false,
        password: hashedPassword
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      throw new AuthError('USER_UPDATE_FAILED', 'Falha ao atualizar o usuário.')
    }

    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email, name: updatedUser.name },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    )

    const formattedUser = {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      blocked: updatedUser.blocked,
      firstAccess: updatedUser.firstAccess,
      role: updatedUser.role
    }

    return { user: formattedUser, token }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
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

  const formattedUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    blocked: user.blocked,
    firstAccess: user.firstAccess,
    role: user.role
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  )

  return { user: formattedUser, token }
}

export const handleGetUserById = async (userId) => {
  return User.findById(userId).select('-password')
}
