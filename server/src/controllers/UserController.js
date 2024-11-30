import { handleGetUserProfile } from '../services/UserService.js'

export const getUserProfile = async (req, res) => {
  try {
    const user = await handleGetUserProfile(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    res
      .status(404)
      .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
  }
}
