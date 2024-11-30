import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Company from '../../models/Company.js'
import { authConfig } from '../../config/auth.js'

class AuthError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export const handleRegisterCompany = async (userData) => {
  try {
    const existingUser = await Company.findOne({ email: userData.email })
    if (existingUser) {
      throw new AuthError('USER_EXISTS', 'Email já está em uso.')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new Company({ ...userData, password: hashedPassword })
    await user.save()

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    )

    return { user, token }
  } catch (error) {
    if (error.code === 11000) {
      throw new AuthError(
        'DUPLICATE_KEY',
        'Email, CPF, telefone ou chave PIX já cadastrados'
      )
    }
    throw new AuthError('REGISTRATION_ERROR', 'Erro ao registrar usuário')
  }
}

export const handleLoginCompany = async ({ email, password }) => {
  const user = await Company.findOne({ email })
  if (!user) {
    throw new AuthError('USER_NOT_FOUND', 'Usuário não encontrado')
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

export const handleGetCompanyById = async (userId) => {
  return Company.findById(userId).select('-password')
}
