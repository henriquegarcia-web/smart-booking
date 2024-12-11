import * as S from './styles'
import {
  Button,
  Form,
  DatePicker,
  theme,
  ConfigProvider,
  Tooltip,
  Select,
  InputNumber,
  Tag
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
  filterModeSchemeData,
  IFilterMode,
  pensionSchemeData
} from '@/data/admin'
import { formatBookingData } from '@/utils/functions/formatBookingData'
import { useFilter } from '@/contexts/FilterProvider'
import { useEffect, useState } from 'react'

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
  )
  // seniorCount: Yup.number()
  //   .min(0, 'A quantidade de idosos não pode ser negativa')
  //   .required('A quantidade de idosos é obrigatória')
  //   .defined(),
  // seniorAges: Yup.array().of(
  //   Yup.number()
  //     .min(60, 'A idade mínima para idoso é 60 anos')
  //     .required('A idade do idoso é obrigatória')
  // )
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
    .defined(),
  filterMode: Yup.string().required().defined()
})

type IApartment = Yup.InferType<typeof ApartmentSchema>
export type ISearchForm = Yup.InferType<typeof SearchAccommodationsSchema>

const SearchFormDefaultValues: ISearchForm = {
  checkInOutDate: [null, null],
  mealType: undefined,
  discountRate: undefined,
  apartments: [
    {
      adultCount: 2,
      childCount: 0,
      // seniorCount: 0,
      childrenAges: []
      // seniorAges: []
    }
  ],
  filterMode: filterModeSchemeData[0].modeId
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
    defaultValues: SearchFormDefaultValues
    // disabled: filterResults?.isLoading
  })
  const { errors, isSubmitting, isValid } = formState
  const checkInOutDate = watch('checkInOutDate')
  const isFormValid =
    isValid && checkInOutDate && checkInOutDate[0] && checkInOutDate[1]

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
    const response = await handleFilter(formattedData)
  }

  const formattedFilterModeScheme = filterModeSchemeData.map((role) => ({
    value: role.modeId,
    label: role.modeLabel
  }))

  const formattedPensionScheme = pensionSchemeData.map((role) => ({
    value: role.schemeId,
    label: role.schemeLabel
  }))

  const getFormattedCountOptions = (label: string, length: number) => {
    const formattedCountOptions = Array.from(
      { length: length },
      (_, index) => ({
        value: index + 1,
        label: `${index + 1} ${label}${index + 1 > 1 ? 's' : ''}`
      })
    )
    return formattedCountOptions
  }

  const getFormattedCountFullOptions = (label: string, length: number) => {
    const formattedCountFullOptions = Array.from(
      { length: length },
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
        <S.FormInputDateRangeWrapper>
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
                      field.value?.map((date) =>
                        date ? dayjs(date) : null
                      ) as [Dayjs | null, Dayjs | null]
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
        </S.FormInputDateRangeWrapper>
        <S.FormInputMealTypeWrapper>
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
        </S.FormInputMealTypeWrapper>
      </S.MainFormWrapper>

      <S.ApartmentsFormWrapper>
        {apartments.length < 10 && (
          <Button
            disabled={filterResults?.isLoading || false}
            style={{ width: 'fit-content' }}
            onClick={() => append({ adultCount: 2, childCount: 0 })}
          >
            Adicionar Apartamento
          </Button>
        )}

        {fields.map((field, index) => {
          const childsInputCount = watch(`apartments.${index}.childCount`)

          return (
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
                <S.FormInputWrapper>
                  <h3>Qtde de adultos</h3>

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
                          options={getFormattedCountOptions('adulto', 8)}
                          disabled={filterResults?.isLoading || false}
                        />
                      </Form.Item>
                    )}
                  />
                </S.FormInputWrapper>
                <S.FormInputWrapper>
                  <h3>Qtde de crianças</h3>

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
                          options={getFormattedCountFullOptions('criança', 9)}
                          disabled={filterResults?.isLoading || false}
                        />
                      </Form.Item>
                    )}
                  />
                </S.FormInputWrapper>

                {childsInputCount > 0 ? (
                  <S.FormInputWrapper>
                    <h3>
                      {childsInputCount > 1 ? (
                        <>Idades das {childsInputCount} crianças</>
                      ) : (
                        <>Idade da criança</>
                      )}
                    </h3>
                    {Array.from({
                      length: childsInputCount
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
                            <Select
                              {...field}
                              placeholder="Selecione uma opção"
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              options={getFormattedCountFullOptions('ano', 14)}
                              disabled={filterResults?.isLoading || false}
                            />
                          </Form.Item>
                        )}
                      />
                    ))}
                  </S.FormInputWrapper>
                ) : (
                  <S.FormInputWrapper />
                )}
              </S.ApartmentSectionWrapper>
            </S.ApartmentSection>
          )
        })}
      </S.ApartmentsFormWrapper>

      <S.SearchAccommodationFormFooter>
        <S.FormFooterErrors>
          {!!filterResults?.data?.filterErrors &&
            filterResults?.data?.filterErrors !== 'without_error' && (
              <>
                Ocorreu um erro em:
                <Tag color="orangered">
                  {filterResults.data?.filterErrors === 'all_portals' &&
                    'Todos os portais'}
                  {filterResults.data?.filterErrors === 'travel_xs' &&
                    'Connect Travel'}
                  {filterResults.data?.filterErrors === 'connect_travel' &&
                    'Travel XS'}
                </Tag>
                Por favor busque novamente!
              </>
            )}
        </S.FormFooterErrors>

        <S.FormFooterInputs>
          <Controller
            name="filterMode"
            control={control}
            defaultValue={filterModeSchemeData[0].modeId}
            render={({ field }) => (
              <Form.Item label="Selecione uma opção de filtro">
                <Select
                  {...field}
                  placeholder="Selecione uma opção"
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                  options={formattedFilterModeScheme}
                  disabled={!isFormValid || filterResults?.isLoading || false}
                />
              </Form.Item>
            )}
          />

          <Button
            disabled={!isFormValid || filterResults?.isLoading}
            onClick={handleResetForm}
          >
            Limpar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isFormValid}
            loading={isSubmitting || filterResults?.isLoading}
          >
            {filterResults?.isLoading ? 'Buscando' : 'Buscar'}
          </Button>
        </S.FormFooterInputs>
      </S.SearchAccommodationFormFooter>
    </S.SearchAccommodationForm>
  )
}

export default SearchAccommodationForm
