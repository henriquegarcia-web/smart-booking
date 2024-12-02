import * as S from './styles'

import { Button, Form, Input, Select, theme } from 'antd'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { rolesData } from '@/data/admin'
import { useAuth } from '@/contexts/AuthProvider'

const createUserAccessSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('O e-mail é obrigatório')
    .defined(),
  role: Yup.string().required('A permissão é obrigatória').defined()
})

type ICreateForm = Yup.InferType<typeof createUserAccessSchema>

interface ICreateFormData {
  email: string
  role: string
}

const CreateFormDefaultValues = {
  email: '',
  role: ''
}

interface ICreateUserAccessForm {
  closeModal: () => void
}

const CreateUserAccessForm = ({ closeModal }: ICreateUserAccessForm) => {
  const { token } = theme.useToken()
  const { handleRegisterAccess } = useAuth()

  const { control, handleSubmit, formState, reset } = useForm<ICreateForm>({
    mode: 'all',
    resolver: yupResolver(createUserAccessSchema),
    defaultValues: CreateFormDefaultValues
  })
  const { errors, isSubmitting, isValid } = formState

  const handleResetForm = () => {
    reset()
    closeModal()
  }

  const onSubmit = async (data: ICreateFormData) => {
    const success = await handleRegisterAccess(data)
    if (success) handleResetForm()
  }

  const formattedRoles = rolesData.map((role) => ({
    value: role.roleId,
    label: role.roleLabel
  }))

  return (
    <S.CreateAccessForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="email"
            label="E-mail"
            validateStatus={!!errors.email ? 'error' : ''}
            help={errors?.email?.message || null}
          >
            <Input
              {...field}
              type="email"
              autoComplete="off"
              placeholder="E-mail do usuário"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Form.Item
            name="role"
            label="Permissão"
            validateStatus={!!errors.role ? 'error' : ''}
            help={errors?.role?.message || null}
          >
            <Select
              {...field}
              placeholder="Permissão do usuário"
              onChange={(value) => {
                field.onChange(value)
              }}
              options={formattedRoles}
            />
          </Form.Item>
        )}
      />
      <S.CreateAccessFormFooter>
        <Button
          htmlType="button"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={handleResetForm}
        >
          Cancelar
        </Button>
        <Button htmlType="submit" disabled={!isValid} loading={isSubmitting}>
          Criar
        </Button>
      </S.CreateAccessFormFooter>
    </S.CreateAccessForm>
  )
}

export default CreateUserAccessForm
