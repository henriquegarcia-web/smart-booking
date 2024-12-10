import { useEffect, useState } from 'react'
import * as S from './styles'

import { Button, Form, Input, Modal, Space, theme } from 'antd'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import io from 'socket.io-client'
export const socket = io(import.meta.env.VITE_SERVER_BASE_URL)

const validateOtpSchema = Yup.object().shape({
  otp: Yup.string().required('O código é obrigatório').defined()
})

type IValidateOTPForm = Yup.InferType<typeof validateOtpSchema>

interface IValidateOTPFormData {
  otp: string
}

const ValidateOTPFormDefaultValues = {
  otp: ''
}

interface IOTPForm {}

const OTPForm = ({}: IOTPForm) => {
  const [showOTPForm, setShowOTPForm] = useState(false)

  const handleOpenOTPForm = () => setShowOTPForm(true)
  const handleCloseOTPForm = () => {
    // Não fechamos o modal diretamente aqui
    // Apenas resetamos o formulário
    handleResetForm()
  }

  const { control, handleSubmit, formState, reset } = useForm<IValidateOTPForm>(
    {
      mode: 'all',
      resolver: yupResolver(validateOtpSchema),
      defaultValues: ValidateOTPFormDefaultValues
    }
  )
  const { errors, isSubmitting, isValid } = formState

  const handleResetForm = () => {
    reset()
  }

  useEffect(() => {
    socket.on('enterOTP', () => {
      handleOpenOTPForm()
    })

    return () => {
      socket.off('enterOTP')
    }
  }, [])

  const onSubmit = async (data: IValidateOTPFormData) => {
    socket.emit('submitOTP', data.otp)
    setShowOTPForm(false)
    handleResetForm()
  }

  const handleCancel = () => {
    // Adicionamos uma função específica para cancelar
    setShowOTPForm(false)
    handleResetForm()
  }

  return (
    <Modal
      title="Validação de código"
      open={showOTPForm}
      onCancel={null} // Removemos o onCancel para evitar o fechamento ao clicar fora ou no X
      closable={false} // Removemos o botão de fechar (X) do modal
      maskClosable={false} // Evita que o modal feche ao clicar fora dele
      footer={null}
      style={{ maxWidth: 340 }}
    >
      <S.OTPForm onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <Form.Item
              name="otp"
              label={null}
              validateStatus={!!errors.otp ? 'error' : ''}
              help={errors?.otp?.message || null}
            >
              <Input
                {...field}
                type="otp"
                autoComplete="off"
                placeholder="Código recebido no e-mail"
              />
            </Form.Item>
          )}
        />
        <Space>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            htmlType="submit"
            type="primary"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Validar
          </Button>
        </Space>
      </S.OTPForm>
    </Modal>
  )
}

export default OTPForm
