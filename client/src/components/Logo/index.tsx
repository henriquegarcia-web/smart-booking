import * as S from './styles'

import { theme } from 'antd'

interface ILogo {}

const Logo = ({}: ILogo) => {
  const { token } = theme.useToken()

  return (
    <S.Logo>
      <h1 style={{ color: token.colorTextHeading }}>VMTCot</h1>
    </S.Logo>
  )
}

export default Logo
