import * as S from './styles'
import {
  Button,
  Form,
  DatePicker,
  theme,
  ConfigProvider,
  Tooltip,
  Select,
  InputNumber
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
import { formatBookingData } from '@/utils/functions/formatBookingData'
import { useFilter } from '@/contexts/FilterProvider'
import { useEffect } from 'react'

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
  childrenAges: Yup.array().of(
    Yup.number()
      .min(0, 'A idade da criança não pode ser negativa')
      .max(17, 'A idade máxima para criança é 17 anos')
      .required('A idade da criança é obrigatória')
  ),
  seniorCount: Yup.number()
    .min(0, 'A quantidade de idosos não pode ser negativa')
    .required('A quantidade de idosos é obrigatória')
    .defined(),
  seniorAges: Yup.array().of(
    Yup.number()
      .min(60, 'A idade mínima para idoso é 60 anos')
      .required('A idade do idoso é obrigatória')
  )
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
  mealType: Yup.string()
    .required('O regime de pensão é obrigatório')
    .nullable(),
  discountRate: Yup.number().nullable(),
  apartments: Yup.array()
    .of(ApartmentSchema)
    .min(1, 'Selecione pelo menos um apartamento')
    .defined()
})

type IApartment = Yup.InferType<typeof ApartmentSchema>
export type ISearchForm = Yup.InferType<typeof SearchAccommodationsSchema>

const SearchFormDefaultValues: ISearchForm = {
  checkInOutDate: [null, null],
  mealType: undefined,
  discountRate: undefined,
  apartments: [
    {
      adultCount: 1,
      childCount: 0,
      seniorCount: 0,
      childrenAges: [],
      seniorAges: []
    }
  ]
}

interface ISearchAccommodationForm {}

const SearchAccommodationForm = ({}: ISearchAccommodationForm) => {
  const { token } = theme.useToken()
  const { handleFilter, filterResults } = useFilter()

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
    defaultValues: SearchFormDefaultValues,
    disabled: filterResults?.isLoading || false
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
    const formattedData = formatBookingData(data)
    await handleFilter(formattedData)
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

  // useEffect(() => {
  //   console.log(filterResults?.data)
  // }, [filterResults])

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
                  disabled={filterResults?.isLoading || false}
                />
              </ConfigProvider>
            </Form.Item>
          )}
        />
        <Controller
          name="mealType"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Regime de pensão"
              validateStatus={!!errors.mealType ? 'error' : ''}
              help={errors?.mealType?.message || null}
            >
              <Select
                {...field}
                placeholder="Selecione uma opção"
                options={formattedPensionScheme}
                allowClear
                disabled={filterResults?.isLoading || false}
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
                disabled={filterResults?.isLoading || false}
              />
            </Form.Item>
          )}
        />
      </S.MainFormWrapper>

      <S.ApartmentsFormWrapper>
        {apartments.length < 10 && (
          <Button
            disabled={filterResults?.isLoading || false}
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
                  <Button
                    disabled={filterResults?.isLoading || false}
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
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
                      disabled={filterResults?.isLoading || false}
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
                      disabled={filterResults?.isLoading || false}
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
                      disabled={filterResults?.isLoading || false}
                    />
                  </Form.Item>
                )}
              />
            </S.ApartmentSectionWrapper>
            <S.ApartmentSectionWrapper>
              <S.AgesInputWrapper />
              {watch(`apartments.${index}.childCount`) > 0 ? (
                <S.AgesInputWrapper>
                  <h3>Idades das crianças</h3>
                  {Array.from({
                    length: watch(`apartments.${index}.childCount`)
                  }).map((_, childIndex) => (
                    <Controller
                      key={childIndex}
                      name={`apartments.${index}.childrenAges.${childIndex}`}
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <Form.Item
                          validateStatus={
                            errors.apartments?.[index]?.childrenAges?.[
                              childIndex
                            ]
                              ? 'error'
                              : ''
                          }
                          help={
                            errors.apartments?.[index]?.childrenAges?.[
                              childIndex
                            ]?.message
                          }
                        >
                          <InputNumber
                            {...field}
                            addonBefore={`Criança ${childIndex + 1}`}
                            min={0}
                            max={13}
                            placeholder="Idade"
                            disabled={filterResults?.isLoading || false}
                          />
                        </Form.Item>
                      )}
                    />
                  ))}
                </S.AgesInputWrapper>
              ) : (
                <S.AgesInputWrapper />
              )}
              {watch(`apartments.${index}.seniorCount`) > 0 ? (
                <S.AgesInputWrapper>
                  <h3>Idades dos idosos</h3>
                  {Array.from({
                    length: watch(`apartments.${index}.seniorCount`)
                  }).map((_, seniorIndex) => (
                    <Controller
                      key={seniorIndex}
                      name={`apartments.${index}.seniorAges.${seniorIndex}`}
                      control={control}
                      defaultValue={60}
                      render={({ field }) => (
                        <Form.Item
                          validateStatus={
                            errors.apartments?.[index]?.seniorAges?.[
                              seniorIndex
                            ]
                              ? 'error'
                              : ''
                          }
                          help={
                            errors.apartments?.[index]?.seniorAges?.[
                              seniorIndex
                            ]?.message
                          }
                        >
                          <InputNumber
                            {...field}
                            addonBefore={`Idoso ${seniorIndex + 1}`}
                            min={60}
                            placeholder="Idade"
                            disabled={filterResults?.isLoading || false}
                          />
                        </Form.Item>
                      )}
                    />
                  ))}
                </S.AgesInputWrapper>
              ) : (
                <S.AgesInputWrapper />
              )}
            </S.ApartmentSectionWrapper>
          </S.ApartmentSection>
        ))}
      </S.ApartmentsFormWrapper>

      <S.SearchAccommodationFormFooter>
        <Button onClick={handleResetForm}>Limpar</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormValid || filterResults?.isLoading}
          loading={isSubmitting}
        >
          Buscar
        </Button>
      </S.SearchAccommodationFormFooter>
    </S.SearchAccommodationForm>
  )
}

export default SearchAccommodationForm
