import { useFilter } from '@/contexts/FilterProvider'
import * as S from './styles'

import { SearchAcommodationForm, ViewHeader } from '@/components'
import {
  applyDiscount,
  formatTextToCurrency
} from '@/utils/functions/formatCurrency'
import { Button, Collapse, Table, theme } from 'antd'
import type { CollapseProps, TableProps } from 'antd'
import { useMemo } from 'react'

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Filtros',
    children: <SearchAcommodationForm />
  }
]

interface IFilterData {
  key: string
  accommodationName: string
  accommodationPrice: string
  accommodationMeal: string
}

const columns: TableProps<IFilterData>['columns'] = [
  {
    title: 'Hospedagem',
    dataIndex: 'accommodationName',
    key: 'accommodationName'
  },
  {
    title: 'Preço',
    dataIndex: 'accommodationPrice',
    key: 'accommodationPrice'
  },
  {
    title: 'Tipo de Pensão',
    dataIndex: 'accommodationMeal',
    key: 'accommodationMeal'
  }
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   )
  // }
]

interface IAccommodationSearchView {}

const AccommodationSearchView = ({}: IAccommodationSearchView) => {
  const { token } = theme.useToken()
  const { filterData, filterResults } = useFilter()

  const formattedUsersList: IFilterData[] = useMemo(() => {
    if (!filterResults?.data?.filterResults) return []

    return filterResults.data.filterResults.map((accommodation, index) => ({
      key: `${accommodation.accommodationName}-${accommodation.accommodationPrice}-${accommodation.accommodationMeal}-${index}`,
      accommodationName: accommodation?.accommodationName || '',
      accommodationPrice:
        applyDiscount(
          accommodation?.accommodationPrice || '',
          filterData.discount || 0
        ) || '',
      accommodationMeal: accommodation?.accommodationMeal || ''
    }))
  }, [filterData, filterResults])

  return (
    <S.AccommodationSearchView>
      <ViewHeader
        title="Filtro de Hospedagens"
        legend="Filtro e obtenha uma lista de hospedagens"
      >
        <Button
          disabled={!filterResults?.data || filterResults?.isLoading}
          onClick={() => {}}
        >
          Exportar Dados
        </Button>
      </ViewHeader>

      <Collapse items={items} />

      <Table<IFilterData>
        columns={columns}
        dataSource={formattedUsersList}
        style={{
          borderRadius: 8,
          border: `1px solid ${token.colorBorder}`
        }}
      />
    </S.AccommodationSearchView>
  )
}

export default AccommodationSearchView
