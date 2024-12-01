import * as S from './styles'

import { SearchAcommodationForm, ViewHeader } from '@/components'
import { theme } from 'antd'

interface IAccommodationSearchView {}

const AccommodationSearchView = ({}: IAccommodationSearchView) => {
  const { token } = theme.useToken()

  return (
    <S.AccommodationSearchView>
      <ViewHeader
        title="Filtro de Hospedagens"
        legend="Filtro e obtenha uma lista de hospedagens"
      >
        {/* <Button onClick={handleOpenCreateAccessModal}>Criar Acesso</Button> */}
      </ViewHeader>
      <SearchAcommodationForm />
    </S.AccommodationSearchView>
  )
}

export default AccommodationSearchView
