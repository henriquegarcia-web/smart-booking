import * as S from './styles'

import {
  Button,
  Form,
  InputNumber,
  DatePicker,
  theme,
  ConfigProvider
} from 'antd'
const { RangePicker } = DatePicker
import locale from 'antd/locale/pt_BR'
import dayjs, { Dayjs } from 'dayjs'

import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

const SearchAccommodationsSchema = Yup.object().shape({
  checkInOutDate: Yup.array()
    .of(Yup.date().nullable())
    .length(2)
    .required('As datas de entrada e saída são obrigatórias')
    .defined(),
  apartmentCount: Yup.number()
    .min(0, 'A quantidade de apartamentos não pode ser negativa')
    .required('A quantidade de apartamentos é obrigatória')
    .defined(),
  adultCount: Yup.number()
    .min(0, 'A quantidade de adultos não pode ser negativa')
    .required('A quantidade de adultos é obrigatória')
    .defined(),
  childCount: Yup.number()
    .min(0, 'A quantidade de crianças não pode ser negativa')
    .required('A quantidade de crianças é obrigatória')
    .defined(),
  seniorCount: Yup.number()
    .min(0, 'A quantidade de idosos não pode ser negativa')
    .required('A quantidade de idosos é obrigatória')
    .defined()
})

type ISearchForm = Yup.InferType<typeof SearchAccommodationsSchema>

const SearchFormDefaultValues: ISearchForm = {
  checkInOutDate: [null, null],
  apartmentCount: 0,
  adultCount: 0,
  childCount: 0,
  seniorCount: 0
}

interface ISearchAccommodationForm {}

const SearchAccommodationForm = ({}: ISearchAccommodationForm) => {
  const { token } = theme.useToken()

  const { control, handleSubmit, formState, reset } = useForm<ISearchForm>({
    mode: 'all',
    resolver: yupResolver(SearchAccommodationsSchema),
    defaultValues: SearchFormDefaultValues
  })
  const { errors, isSubmitting, isValid } = formState

  const handleResetForm = () => {
    reset(SearchFormDefaultValues)
    // closeModal()
  }

  const onSubmit = async (data: ISearchForm) => {
    console.log(data)
  }

  return (
    <S.SearchAccommodationForm
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
    >
      <Controller
        name="checkInOutDate"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="checkInOutDate"
            label="Entrada e Saída"
            validateStatus={errors.checkInOutDate ? 'error' : ''}
            help={errors?.checkInOutDate?.message}
          >
            <ConfigProvider locale={locale}>
              <RangePicker
                {...field}
                format="DD/MM/YYYY"
                placeholder={['Data de entrada', 'Data de saída']}
                value={
                  field.value?.map((date) => (date ? dayjs(date) : null)) as [
                    Dayjs | null,
                    Dayjs | null
                  ]
                }
                onChange={(dates) => {
                  field.onChange(
                    dates?.map((date) => date?.toDate() || null) || [null, null]
                  )
                }}
              />
            </ConfigProvider>
          </Form.Item>
        )}
      />
      <Controller
        name="apartmentCount"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="apartmentCount"
            label="Qtd. de Apartamentos"
            validateStatus={errors.apartmentCount ? 'error' : ''}
            help={errors?.apartmentCount?.message}
          >
            <InputNumber
              {...field}
              addonBefore="Apartamentos"
              min={0}
              placeholder="0"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="adultCount"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="adultCount"
            label="Qtd. de Adultos"
            validateStatus={errors.adultCount ? 'error' : ''}
            help={errors?.adultCount?.message}
          >
            <InputNumber
              {...field}
              addonBefore="Adultos"
              min={0}
              placeholder="0"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="childCount"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="childCount"
            label="Qtd. de Crianças"
            validateStatus={errors.childCount ? 'error' : ''}
            help={errors?.childCount?.message}
          >
            <InputNumber
              {...field}
              addonBefore="Crianças"
              min={0}
              placeholder="0"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="seniorCount"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="seniorCount"
            label="Qtd. de Idosos"
            validateStatus={errors.seniorCount ? 'error' : ''}
            help={errors?.seniorCount?.message}
          >
            <InputNumber
              {...field}
              addonBefore="Idosos"
              min={0}
              placeholder="0"
            />
          </Form.Item>
        )}
      />
      <S.SearchAccommodationFormFooter>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isValid}
          loading={isSubmitting}
        >
          Buscar
        </Button>
      </S.SearchAccommodationFormFooter>
    </S.SearchAccommodationForm>
  )
}

export default SearchAccommodationForm
