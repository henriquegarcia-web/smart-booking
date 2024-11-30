import { useNavigate } from 'react-router-dom'

import * as S from './styles'

import { AuthContainer } from '@/components'
import { Button, Input, Form, theme } from 'antd'

import { useForm, Controller, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { signUpSchema } from '@/utils/schemas/auth'
import { useAuth } from '@/contexts/AuthProvider'

interface ISignUpFormData {
  name: string
  email: string
  password: string
}

const SignUpScreen = () => {
  const { token } = theme.useToken()
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const { control, handleSubmit, formState } = useForm<ISignUpFormData>({
    mode: 'all',
    resolver: yupResolver(signUpSchema) as Resolver<ISignUpFormData>
  })

  const { errors, isSubmitting, isValid } = formState

  const onSubmit = async (data: ISignUpFormData) => {
    const formattedData = {
      name: data.name,
      email: data.email,
      password: data.password
    }

    const success = await handleRegister(formattedData)
    if (success) {
      navigate('/playground')
    } else {
      console.error('Registration failed')
    }
  }

  return (
    <S.SignUpScreen style={{ backgroundColor: token.colorBgBase }}>
      <AuthContainer type="signup">
        <S.SignUpForm
          onSubmitCapture={handleSubmit(onSubmit)}
          layout="vertical"
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Nome Completo"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Input {...field} placeholder="Nome Completo" />
              </Form.Item>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="E-mail"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Input {...field} placeholder="E-mail" />
              </Form.Item>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Senha"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Input.Password {...field} placeholder="Senha" />
              </Form.Item>
            )}
          />
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Cadastrar
          </Button>
        </S.SignUpForm>
      </AuthContainer>
    </S.SignUpScreen>
  )
}

export default SignUpScreen
