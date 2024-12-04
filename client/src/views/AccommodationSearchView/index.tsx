import * as S from './styles'

import { SearchAcommodationForm, ViewHeader } from '@/components'
import { formatCurrency } from '@/utils/functions/formatCurrency'
import { Collapse, Space, Table, Tag, theme } from 'antd'
import type { CollapseProps, TableProps } from 'antd'

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Filtros',
    children: <SearchAcommodationForm />
  }
]

interface DataType {
  key: string
  accommodationName: string
  accommodationPrice: number
  accommodationMeal: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Hospedagem',
    dataIndex: 'accommodationName',
    key: 'accommodationName'
  },
  {
    title: 'Preço',
    dataIndex: 'accommodationPrice',
    key: 'accommodationPrice',
    render: (price) => formatCurrency(price)
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

const data: DataType[] = [
  {
    key: '1',
    accommodationName: 'John Brown',
    accommodationPrice: 0,
    accommodationMeal: ''
  }
]

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

      <Collapse items={items} defaultActiveKey={['1']} />

      <Table<DataType> columns={columns} dataSource={data} />
    </S.AccommodationSearchView>
  )
}

export default AccommodationSearchView
