import { useNavigate } from 'react-router-dom'

import * as S from './styles'

import { AuthContainer } from '@/components'
import { Button, Input, Form, theme } from 'antd'

import { useForm, Controller, Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { signInSchema } from '@/utils/schemas/auth'
import { useAuth } from '@/contexts/AuthProvider'

interface ISignInFormData {
  email: string
  password: string
}

const SignInScreen = () => {
  const { token } = theme.useToken()
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const { control, handleSubmit, formState } = useForm<ISignInFormData>({
    mode: 'onBlur',
    resolver: yupResolver(signInSchema) as Resolver<ISignInFormData>,
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { errors, isSubmitting, isValid } = formState

  const onSubmit = async (data: ISignInFormData) => {
    const success = await handleLogin(data)
    if (success) {
      navigate('/playground')
    } else {
      console.error('Login failed')
    }
  }

  return (
    <S.SignInScreen style={{ backgroundColor: token.colorBgBase }}>
      <AuthContainer type="signin">
        <S.SignInForm
          onSubmitCapture={handleSubmit(onSubmit)}
          layout="vertical"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <Form.Item
                label="E-mail"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Input {...field} placeholder="Digite seu e-mail" />
              </Form.Item>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <Form.Item
                label="Senha"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Input.Password {...field} placeholder="Digite sua senha" />
              </Form.Item>
            )}
          />
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Entrar
          </Button>
        </S.SignInForm>
      </AuthContainer>
    </S.SignInScreen>
  )
}

export default SignInScreen
