import {
  handleGetUserProfile,
  handleGetAllUsers
} from '../services/UserService.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = await handleGetUserProfile(req.user.id)

    const formattedUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      blocked: user.blocked,
      firstAccess: user.firstAccess,
      role: user.role
    }

    res.status(200).json(formattedUser)
  } catch (error) {
    res
      .status(404)
      .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
  }
}

export const getAllUsersProfile = async (req, res) => {
  try {
    const users = await handleGetAllUsers()

    const formattedUsers = users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      blocked: user.blocked,
      firstAccess: user.firstAccess,
      role: user.role
    }))

    res.status(200).json(formattedUsers)
  } catch (error) {
    res
      .status(404)
      .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
  }
}
