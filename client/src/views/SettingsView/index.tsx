import { useState } from 'react'
import * as S from './styles'

import { ViewHeader } from '@/components'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Tabs,
  Tag,
  theme
} from 'antd'
import type { TabsProps } from 'antd'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { FiAlertCircle } from 'react-icons/fi'

const SendOTPSchema = Yup.object().shape({
  otp: Yup.string().required('O código é obrigatório').defined()
})

type ISendOTPForm = Yup.InferType<typeof SendOTPSchema>

interface ISendOTPFormData {
  otp: string
}

const SendOTPFormDefaultValues = {
  otp: ''
}

const ConnectTravelAuthentication = () => {
  const { token } = theme.useToken()
  const [hasToValidadeOTP, setHasToValidadeOTP] = useState(false)

  const { control, handleSubmit, formState, reset } = useForm<ISendOTPForm>({
    mode: 'all',
    resolver: yupResolver(SendOTPSchema),
    defaultValues: SendOTPFormDefaultValues,
    disabled: !hasToValidadeOTP
  })
  const { errors, isSubmitting, isValid } = formState

  const handleResetForm = () => {
    reset()
  }

  const onSubmit = async (data: ISendOTPFormData) => {
    // const success = await handleRegisterAccess(data)
    const success = true
    if (success) handleResetForm()
  }

  return (
    <S.CTAuthentication
      style={{
        border: `1px solid ${token.colorBorder}`
      }}
    >
      <S.CTAuthenticationInfos>
        <S.CTAuthenticationStatus>
          <p>Nova autenticação necessária em:</p>
          <b
            style={{
              color: token.colorPrimary
            }}
          >
            8 dias
            <FiAlertCircle />
          </b>
        </S.CTAuthenticationStatus>
        <S.CTAuthenticationStatus>
          <p>Última autenticação em:</p>
          <b>01/12/2024</b>
        </S.CTAuthenticationStatus>
        <S.CTAuthenticationStatus>
          <p>Status:</p>
          <Tag>Autenticado</Tag>
        </S.CTAuthenticationStatus>
      </S.CTAuthenticationInfos>
      <S.CTAuthenticationForm onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} autoComplete="off" placeholder="Código" />
          )}
        />
        <Button htmlType="submit" disabled={!isValid} loading={isSubmitting}>
          Validar
        </Button>
      </S.CTAuthenticationForm>
    </S.CTAuthentication>
  )
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Autenticação',
    children: <ConnectTravelAuthentication />
  }
]

interface ISettingsView {}

const SettingsView = ({}: ISettingsView) => {
  const { token } = theme.useToken()

  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <S.SettingsView>
      <ViewHeader title="Configurações" legend="Gerencie a aplicação VMTCot">
        {/* <Select
          placeholder="Selecione um desconto"
          options={formattedDiscountRates}
          allowClear
          disabled={filterResults?.isLoading || isDownloadLoading || false}
          onChange={handleChangeDiscount}
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
          onClick={() => generateAndDownloadTxt(filterResults?.data)}
        >
          Exportar Dados
        </Button> */}
      </ViewHeader>

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </S.SettingsView>
  )
}

export default SettingsView
