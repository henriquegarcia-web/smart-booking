import { Link } from 'react-router-dom'

import * as S from './styles'

import { theme } from 'antd'

interface IAuthContainer {
  type: 'signin' | 'signup'
  children: React.ReactNode
}

const AuthContainer = ({ type, children }: IAuthContainer) => {
  const { token } = theme.useToken()

  return (
    <S.AuthContainer
      style={{
        border: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer
      }}
    >
      <S.AuthHeader>
        <h2 style={{ color: token.colorTextHeading }}>
          {type === 'signin' ? 'Entrar' : 'Criar Conta'}
        </h2>
      </S.AuthHeader>
      <S.AuthContent>{children}</S.AuthContent>
      {/* <S.AuthFooter>
        {type === 'signin' ? (
          <p style={{ color: token.colorTextLabel }}>
            Não possui cadastro?{' '}
            <Link to="/cadastrar" style={{ color: token.colorTextLabel }}>
              Criar Conta
            </Link>
          </p>
        ) : (
          <p style={{ color: token.colorTextLabel }}>
            Já possui cadastro?{' '}
            <Link to="/entrar" style={{ color: token.colorTextLabel }}>
              Entrar
            </Link>
          </p>
        )}
      </S.AuthFooter> */}
    </S.AuthContainer>
  )
}

export default AuthContainer
