import * as S from './styles'

import { Logo, UserMenu } from '@/components'

import { theme } from 'antd'

// import { useGetTemplate } from '@/hooks/data/useGetTemplate'

interface IDashboardScreen {}

const DashboardScreen = ({}: IDashboardScreen) => {
  const { token } = theme.useToken()

  // const {
  //   data: dataTemplate,
  //   error: errorTemplate,
  //   fetchStatus,
  //   isLoading
  // } = useGetTemplate()

  return (
    <S.DashboardScreen style={{ backgroundColor: token.colorBgBase }}>
      <S.DashboardHeader
        style={{ borderBottom: `1px solid ${token.colorBorder}` }}
      >
        <S.DashboardLogo>
          <Logo />
        </S.DashboardLogo>
        <S.DashboardNavigation>{/* <UserMenu /> */}</S.DashboardNavigation>
      </S.DashboardHeader>
      <S.DashboardContent>
        <S.DashboardContentWrapper
          style={{ border: `1px solid ${token.colorBorder}` }}
        ></S.DashboardContentWrapper>
      </S.DashboardContent>
    </S.DashboardScreen>
  )
}

export default DashboardScreen
