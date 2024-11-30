import { useMutation } from '@tanstack/react-query'
import { register, login } from '@/services/auth'

const useRegister = () => {
  return useMutation({
    mutationFn: register
  })
}

const useLogin = () => {
  return useMutation({
    mutationFn: login
  })
}

export { useRegister, useLogin }
