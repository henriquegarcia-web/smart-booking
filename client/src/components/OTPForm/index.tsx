import { useEffect, useState } from 'react'
import * as S from './styles'

import { Button, Form, Input, Modal, theme } from 'antd'
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
  // const [otp, setOtp] = useState('')

  const handleOpenOTPForm = () => setShowOTPForm(true)
  const handleCloseOTPForm = () => setShowOTPForm(false)

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
    handleCloseOTPForm()
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
    handleCloseOTPForm()
    handleResetForm()
  }

  return (
    <Modal
      title="Validação de código"
      open={showOTPForm}
      footer={null}
      onCancel={handleCloseOTPForm}
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
        <Button htmlType="submit" disabled={!isValid} loading={isSubmitting}>
          Validar
        </Button>
      </S.OTPForm>
    </Modal>
  )
}

export default OTPForm
