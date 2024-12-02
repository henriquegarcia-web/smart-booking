import * as S from './styles'
import {
  Button,
  Form,
  DatePicker,
  theme,
  ConfigProvider,
  Tooltip,
  Select
} from 'antd'
const { RangePicker } = DatePicker
import locale from 'antd/locale/pt_BR'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import {
  discountRate,
  filterCountsLimit,
  pensionSchemeData
} from '@/data/admin'

const ApartmentSchema = Yup.object().shape({
  adultCount: Yup.number()
    .min(0, 'A quantidade de adultos não pode ser negativa')
    .min(1, 'É preciso de no mínimo 1 adulto por apartamento')
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

const SearchAccommodationsSchema = Yup.object().shape({
  checkInOutDate: Yup.array()
    .of(Yup.date().nullable())
    .length(2)
    .test(
      'both-dates-filled',
      'As datas de entrada e saída são obrigatórias',
      (value) => {
        return value && value[0] !== null && value[1] !== null
      }
    )
    .required('As datas de entrada e saída são obrigatórias')
    .defined(),
  boardPlan: Yup.string()
    .required('O regime de pensão é obrigatório')
    .nullable(),
  discountRate: Yup.number().nullable(),
  apartments: Yup.array()
    .of(ApartmentSchema)
    .min(1, 'Selecione pelo menos um apartamento')
    .defined()
})

type IApartment = Yup.InferType<typeof ApartmentSchema>
type ISearchForm = Yup.InferType<typeof SearchAccommodationsSchema>

const SearchFormDefaultValues: ISearchForm = {
  checkInOutDate: [null, null],
  boardPlan: undefined,
  discountRate: undefined,
  apartments: [
    {
      adultCount: 1,
      childCount: 0,
      seniorCount: 0
    }
  ]
}

interface ISearchAccommodationForm {}

const SearchAccommodationForm = ({}: ISearchAccommodationForm) => {
  const { token } = theme.useToken()

  const {
    control,
    handleSubmit,
    formState,
    reset,
    watch,
    setValue,
    resetField
  } = useForm<ISearchForm>({
    mode: 'all',
    resolver: yupResolver(SearchAccommodationsSchema),
    defaultValues: SearchFormDefaultValues
  })
  const { errors, isSubmitting, isValid } = formState
  const checkInOutDate = watch('checkInOutDate')
  const isFormValid = isValid && checkInOutDate[0] && checkInOutDate[1]

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'apartments'
  })

  const apartments = watch('apartments')

  const handleResetForm = () => {
    reset(SearchFormDefaultValues)
  }

  const onSubmit = async (data: ISearchForm) => {
    console.log(data)
  }

  const formattedPensionScheme = pensionSchemeData.map((role) => ({
    value: role.schemeId,
    label: role.schemeLabel
  }))

  const formattedDiscountRates = Array.from(
    { length: discountRate },
    (_, index) => ({
      value: index + 1,
      label: `${index + 1}%`
    })
  )

  const getFormattedCountOptions = (label: string) => {
    const formattedCountOptions = Array.from(
      { length: filterCountsLimit },
      (_, index) => ({
        value: index + 1,
        label: `${index + 1} ${label}${index + 1 > 1 ? 's' : ''}`
      })
    )
    return formattedCountOptions
  }

  const getFormattedCountFullOptions = (label: string) => {
    const formattedCountFullOptions = Array.from(
      { length: filterCountsLimit },
      (_, index) => ({
        value: index,
        label: `${index} ${label}${index === 1 ? '' : 's'}`
      })
    )
    return formattedCountFullOptions
  }

  return (
    <S.SearchAccommodationForm
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
    >
      <S.MainFormWrapper>
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
                      dates?.map((date) => date?.toDate() || null) || [
                        null,
                        null
                      ]
                    )
                  }}
                />
              </ConfigProvider>
            </Form.Item>
          )}
        />
        <Controller
          name="boardPlan"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Regime de pensão"
              validateStatus={!!errors.boardPlan ? 'error' : ''}
              help={errors?.boardPlan?.message || null}
            >
              <Select
                {...field}
                placeholder="Selecione uma opção"
                options={formattedPensionScheme}
                allowClear
              />
            </Form.Item>
          )}
        />
        <Controller
          name="discountRate"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Desconto (Opcional)"
              validateStatus={!!errors.discountRate ? 'error' : ''}
              help={errors?.discountRate?.message || null}
            >
              <Select
                {...field}
                placeholder="Selecione uma opção"
                options={formattedDiscountRates}
                allowClear
              />
            </Form.Item>
          )}
        />
      </S.MainFormWrapper>

      <S.ApartmentsFormWrapper>
        {apartments.length < 10 && (
          <Button
            style={{ width: 'fit-content' }}
            onClick={() =>
              append({ adultCount: 1, childCount: 0, seniorCount: 0 })
            }
          >
            Adicionar Apartamento
          </Button>
        )}

        {fields.map((field, index) => (
          <S.ApartmentSection
            key={field.id}
            style={{ border: `1px solid ${token.colorBorder}` }}
          >
            <S.ApartmentSectionHeader>
              <h2>Apartamento {index + 1}</h2>

              {index > 0 && (
                <Tooltip
                  placement="topRight"
                  title={`Remover apartamento ${index + 1}`}
                  arrow={true}
                >
                  <Button onClick={() => remove(index)}>Remover</Button>
                </Tooltip>
              )}
            </S.ApartmentSectionHeader>
            <S.ApartmentSectionWrapper>
              <Controller
                name={`apartments.${index}.adultCount`}
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={
                      errors.apartments?.[index]?.adultCount ? 'error' : ''
                    }
                    help={errors.apartments?.[index]?.adultCount?.message}
                  >
                    <Select
                      {...field}
                      placeholder="Selecione uma opção"
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                      options={getFormattedCountOptions('adulto')}
                    />
                  </Form.Item>
                )}
              />
              <Controller
                name={`apartments.${index}.childCount`}
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={
                      errors.apartments?.[index]?.childCount ? 'error' : ''
                    }
                    help={errors.apartments?.[index]?.childCount?.message}
                  >
                    <Select
                      {...field}
                      placeholder="Selecione uma opção"
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                      options={getFormattedCountFullOptions('criança')}
                    />
                  </Form.Item>
                )}
              />
              <Controller
                name={`apartments.${index}.seniorCount`}
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={
                      errors.apartments?.[index]?.seniorCount ? 'error' : ''
                    }
                    help={errors.apartments?.[index]?.seniorCount?.message}
                  >
                    <Select
                      {...field}
                      placeholder="Selecione uma opção"
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                      options={getFormattedCountFullOptions('idoso')}
                    />
                  </Form.Item>
                )}
              />
            </S.ApartmentSectionWrapper>
          </S.ApartmentSection>
        ))}
      </S.ApartmentsFormWrapper>

      <S.SearchAccommodationFormFooter>
        <Button onClick={handleResetForm}>Limpar</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormValid}
          loading={isSubmitting}
        >
          Buscar
        </Button>
      </S.SearchAccommodationFormFooter>
    </S.SearchAccommodationForm>
  )
}

export default SearchAccommodationForm
