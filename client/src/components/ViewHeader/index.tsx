import * as S from './styles'

import { theme } from 'antd'

interface IViewHeader {
  title: string
  legend: string
  children?: React.ReactNode
}

const ViewHeader = ({ title, legend, children }: IViewHeader) => {
  const { token } = theme.useToken()

  return (
    <S.ViewHeader style={{ borderBottom: `1px solid ${token.colorBorder}` }}>
      <S.ViewHeaderLabels>
        <h1 style={{ color: token.colorTextHeading }}>{title}</h1>
        <p style={{ color: token.colorTextHeading }}>{legend}</p>
      </S.ViewHeaderLabels>
      {children && <S.ViewHeaderContent>{children}</S.ViewHeaderContent>}
    </S.ViewHeader>
  )
}

export default ViewHeader
