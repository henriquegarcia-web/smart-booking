import { useMemo, useState } from 'react'
import {
  IFilterResults,
  IFilterResultsData,
  useFilter
} from '@/contexts/FilterProvider'
import * as S from './styles'

import locale from 'antd/locale/pt_BR'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

import { OTPForm, SearchAcommodationForm, ViewHeader } from '@/components'
import {
  applyDiscount,
  formatTextToCurrency
} from '@/utils/functions/formatCurrency'
import {
  Button,
  Collapse,
  ConfigProvider,
  Select,
  Table,
  Tag,
  theme
} from 'antd'
import type { CollapseProps, TableProps } from 'antd'
import { discountRate, fileTypesSchemeData } from '@/data/admin'
import { FiDownload } from 'react-icons/fi'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Filtros',
    children: <SearchAcommodationForm />
  }
]

interface IFilterData {
  key: string
  accommodationProvider: string
  accommodationName: string
  accommodationPrice: string
  accommodationMeal: string
}

const formatProviderTag = (providerId: string) => {
  switch (providerId) {
    case 'hot_beach':
      return <Tag color="#0D4FAD">Portal Hot Beach</Tag>
    case 'enjoy':
      return <Tag color="#52B7C1">Portal Enjoy</Tag>
    case 'connect_travel':
      return <Tag color="#9100ff">Portal Connect</Tag>
    default:
      return ''
  }
}

const columns: TableProps<IFilterData>['columns'] = [
  {
    title: 'Portal',
    dataIndex: 'accommodationProvider',
    key: 'accommodationProvider',
    render: (tag) => formatProviderTag(tag)
  },
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
]

interface IAccommodationSearchView {}

const AccommodationSearchView = ({}: IAccommodationSearchView) => {
  const { token } = theme.useToken()
  const { filterResults } = useFilter()

  const [selectedDiscount, setSelectedDiscount] = useState<number>(0)
  const [selectedFileType, setSelectedFileType] = useState<string>(
    fileTypesSchemeData[0].typeId
  )
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false)

  const formattedUsersList: IFilterData[] = useMemo(() => {
    if (!filterResults?.data?.filterResults) return []

    return filterResults.data.filterResults.map((accommodation, index) => ({
      key: `${accommodation.accommodationName}-${accommodation.accommodationPrice}-${accommodation.accommodationMeal}-${index}`,
      accommodationProvider: accommodation.accommodationProvider || '',
      accommodationName: accommodation?.accommodationName || '',
      accommodationPrice:
        applyDiscount(
          accommodation?.accommodationPrice.toString() || '',
          selectedDiscount || 0
        ) || '',
      accommodationMeal: accommodation?.accommodationMeal || ''
    }))
  }, [selectedDiscount, filterResults])

  const handleChangeDiscount = (value: number | null) => {
    setSelectedDiscount(value ?? 0)
  }

  const handleChangeFileType = (type: string) => {
    setSelectedFileType(type)
  }

  const generateAndDownloadPdf = (data: IFilterResultsData) => {}

  const generateAndDownloadTxt = (data: IFilterResultsData) => {
    try {
      setIsDownloadLoading(true)

      let content = `${data.filterDateRange}${
        selectedDiscount > 0 ? `/${selectedDiscount}` : ''
      }\n`
      content += `${data.filterAdults} adulto(s)\n`
      content +=
        data.filterChilds > 0 ? `${data.filterChilds} criança(s)\n\n` : '\n'

      data.filterResults.forEach((accommodation) => {
        content += `${accommodation.accommodationName}\n`
        content += `${applyDiscount(
          accommodation.accommodationPrice,
          selectedDiscount,
          false
        )}\n`
        content += `${accommodation.accommodationMeal}\n\n`
      })

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, 'lista_de_hospedagem.txt')
      toast('Download realizado com sucesso')
    } catch (error) {
      toast('Falha ao realizar download')
    } finally {
      setIsDownloadLoading(false)
    }
  }

  const handleDownloadData = (data: IFilterResultsData) => {
    if (selectedFileType === 'type_txt') {
      generateAndDownloadTxt(data)
      return
    }
    if (selectedFileType === 'type_pdf') {
      generateAndDownloadPdf(data)
    }
  }

  const formattedDiscountRates = Array.from(
    { length: discountRate },
    (_, index) => ({
      value: index + 1,
      label: `${index + 1}%`
    })
  )

  const formattedFileTypesScheme = fileTypesSchemeData.map((fileType) => ({
    value: fileType.typeId,
    label: fileType.typeLabel
  }))

  return (
    <S.AccommodationSearchView>
      <ViewHeader
        title="Filtro de Hospedagens"
        legend="Filtro e obtenha uma lista de hospedagens"
      >
        <Select
          placeholder="Desconto (%)"
          options={formattedDiscountRates}
          allowClear
          disabled={filterResults?.isLoading || isDownloadLoading}
          onChange={handleChangeDiscount}
        />
        <Select
          placeholder="Formato do arquivo"
          options={formattedFileTypesScheme}
          defaultValue={fileTypesSchemeData[0].typeId}
          disabled={filterResults?.isLoading || isDownloadLoading}
          onChange={handleChangeFileType}
        />
        <Button
          type="dashed"
          disabled={
            !filterResults?.data ||
            filterResults?.isLoading ||
            isDownloadLoading
          }
          icon={<FiDownload />}
          iconPosition="start"
          onClick={() => handleDownloadData(filterResults?.data)}
        >
          Exportar Dados
        </Button>
        {/* <Button onClick={triggerOTPManually}>Testar OTP</Button> */}
      </ViewHeader>

      <Collapse items={items} />

      <ConfigProvider locale={locale}>
        <Table<IFilterData>
          columns={columns}
          dataSource={formattedUsersList}
          style={{
            borderRadius: 8,
            border: `1px solid ${token.colorBorder}`
          }}
        />
      </ConfigProvider>

      <OTPForm />
    </S.AccommodationSearchView>
  )
}

export default AccommodationSearchView

// const triggerOTPManually = () => {
//   console.log('Simulando evento requestOTP')
//   socket.emit('requestOTP')
// }
