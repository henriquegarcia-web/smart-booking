import {
  handleGetUserProfile,
  handleGetAllUsers,
  handleDeleteUser,
  handleToggleUserBlock
} from '../services/UserService.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = await handleGetUserProfile(req.params.userId)

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

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await handleDeleteUser(req.params.userId)
    res
      .status(200)
      .json({ message: 'Usuário deletado com sucesso', user: deletedUser })
  } catch (error) {
    console.log(error)
    if (error.message === 'User not found') {
      res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
    } else {
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao deletar usuário'
      })
    }
  }
}

export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params
    const { blockStatus } = req.body
    const updatedUser = await handleToggleUserBlock(userId, blockStatus)
    const action = blockStatus ? 'bloqueado' : 'desbloqueado'
    res
      .status(200)
      .json({ message: `Usuário ${action} com sucesso`, user: updatedUser })
  } catch (error) {
    if (error.message === 'User not found') {
      res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
    } else {
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao alterar status de bloqueio do usuário'
      })
    }
  }
}
