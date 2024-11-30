import {
  handleGetProfessionalProfile,
  handleGetCompanyProfile
} from '../../services/user/Service.js'

export const getProfessionalProfile = async (req, res) => {
  try {
    const user = await handleGetProfessionalProfile(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    res
      .status(404)
      .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
  }
}

export const getCompanyProfile = async (req, res) => {
  try {
    const user = await handleGetCompanyProfile(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    res
      .status(404)
      .json({ code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' })
  }
}
