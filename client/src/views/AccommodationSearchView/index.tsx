import * as S from './styles'

import { theme } from 'antd'

interface IAccommodationSearchView {}

const AccommodationSearchView = ({}: IAccommodationSearchView) => {
  const { token } = theme.useToken()

  return (
    <S.AccommodationSearchView>
      Listagem de Hospedagens
    </S.AccommodationSearchView>
  )
}

export default AccommodationSearchView
