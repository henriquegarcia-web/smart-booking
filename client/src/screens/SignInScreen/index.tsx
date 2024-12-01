import { useNavigate } from 'react-router-dom'
import * as S from './styles'
import { AuthContainer } from '@/components'
import { Button, Input, Form, theme, Checkbox } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthProvider'
import { useState } from 'react'

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: Yup.string().required('Senha é obrigatória'),
  name: Yup.string().when('isFirstAccess', {
    is: true,
    then: (schema) => schema.required('Nome é obrigatório'),
    otherwise: (schema) => schema.notRequired()
  }),
  isFirstAccess: Yup.boolean().required(
    'É obrigatório informar se é o primeiro acesso'
  )
})

type ISignInForm = Yup.InferType<typeof SignInSchema>

interface ISignInFormData {
  name?: string
  email: string
  password: string
  isFirstAccess: boolean
}

const SignInScreen = () => {
  const { token } = theme.useToken()
  const { handleLogin, handleRegister } = useAuth()
  const navigate = useNavigate()
  const [isFirstAccess, setIsFirstAccess] = useState(false)

  const { control, handleSubmit, formState, watch } = useForm<ISignInForm>({
    mode: 'all',
    resolver: yupResolver(SignInSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isFirstAccess: false
    }
  })

  const { errors, isSubmitting, isValid } = formState
  const watchIsFirstAccess = watch('isFirstAccess')

  const onSubmit = async (data: ISignInFormData) => {
    let success
    if (data.isFirstAccess) {
      if (data.name) {
        success = await handleRegister({
          name: data.name,
          email: data.email,
          password: data.password
        })
      } else {
        console.error('Nome é obrigatório para registro')
        return
      }
    } else {
      success = await handleLogin({
        email: data.email,
        password: data.password
      })
    }
    if (success) {
      navigate('/playground')
    }
  }

  return (
    <S.SignInScreen style={{ backgroundColor: token.colorBgBase }}>
      <AuthContainer type="signin">
        <S.SignInForm
          onSubmitCapture={handleSubmit(onSubmit)}
          layout="vertical"
        >
          {watchIsFirstAccess && (
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Nome"
                  validateStatus={errors.name ? 'error' : ''}
                  help={errors.name?.message}
                >
                  <Input {...field} placeholder="Digite seu nome" />
                </Form.Item>
              )}
            />
          )}
          <Controller
            name="email"
            control={control}
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
            render={({ field }) => (
              <Form.Item
                label={isFirstAccess ? 'Criar Senha' : 'Senha'}
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Input.Password {...field} placeholder="Digite sua senha" />
              </Form.Item>
            )}
          />
          <S.SignInFormFirstAccess>
            <p>Primeiro acesso?</p>
            <Controller
              name="isFirstAccess"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked)
                    setIsFirstAccess(e.target.checked)
                  }}
                />
              )}
            />
          </S.SignInFormFirstAccess>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isValid}
            loading={isSubmitting}
          >
            {watchIsFirstAccess ? 'Registrar' : 'Entrar'}
          </Button>
        </S.SignInForm>
      </AuthContainer>
    </S.SignInScreen>
  )
}

export default SignInScreen
