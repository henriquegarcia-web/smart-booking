import * as S from './styles'
import {
  Button,
  Form,
  InputNumber,
  DatePicker,
  theme,
  ConfigProvider,
  Space,
  Typography,
  Tooltip
} from 'antd'
const { RangePicker } = DatePicker
const { Text } = Typography
import locale from 'antd/locale/pt_BR'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'
dayjs.locale('pt-br')

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

const ApartmentSchema = Yup.object().shape({
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

const SearchAccommodationsSchema = Yup.object().shape({
  checkInOutDate: Yup.array()
    .of(Yup.date().nullable())
    .length(2)
    .required('As datas de entrada e saída são obrigatórias')
    .defined(),
  apartments: Yup.array()
    .of(ApartmentSchema)
    .min(1, 'Selecione pelo menos um apartamento')
})

type IApartment = Yup.InferType<typeof ApartmentSchema>
type ISearchForm = Yup.InferType<typeof SearchAccommodationsSchema>

const SearchFormDefaultValues: ISearchForm = {
  checkInOutDate: [null, null],
  apartments: [
    {
      adultCount: 0,
      childCount: 0,
      seniorCount: 0
    }
  ]
}

interface ISearchAccommodationForm {}

const SearchAccommodationForm = ({}: ISearchAccommodationForm) => {
  const { token } = theme.useToken()

  const { control, handleSubmit, formState, reset, watch } =
    useForm<ISearchForm>({
      mode: 'all',
      resolver: yupResolver(SearchAccommodationsSchema),
      defaultValues: SearchFormDefaultValues
    })
  const { errors, isSubmitting, isValid } = formState

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

  return (
    <S.SearchAccommodationForm
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
    >
      <S.FormWrapper>
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
      </S.FormWrapper>

      <S.FormWrapper>
        {apartments.length < 10 && (
          <Button
            style={{ width: 'fit-content' }}
            onClick={() =>
              append({ adultCount: 0, childCount: 0, seniorCount: 0 })
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
                    <InputNumber
                      {...field}
                      addonBefore="Adultos"
                      min={0}
                      placeholder="0"
                      width="100%"
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
                name={`apartments.${index}.seniorCount`}
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={
                      errors.apartments?.[index]?.seniorCount ? 'error' : ''
                    }
                    help={errors.apartments?.[index]?.seniorCount?.message}
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
            </S.ApartmentSectionWrapper>
          </S.ApartmentSection>
        ))}
      </S.FormWrapper>

      <S.SearchAccommodationFormFooter>
        <Button onClick={handleResetForm}>Limpar</Button>
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
