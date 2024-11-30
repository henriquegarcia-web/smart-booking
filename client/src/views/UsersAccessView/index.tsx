import * as S from './styles'

import { theme } from 'antd'

interface IUsersAccessView {}

const UsersAccessView = ({}: IUsersAccessView) => {
  const { token } = theme.useToken()

  return <S.UsersAccessView>Usuários e Acessos</S.UsersAccessView>
}

export default UsersAccessView
