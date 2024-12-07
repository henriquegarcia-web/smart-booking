import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

import { useRegisterAccess, useRegister, useLogin } from '@/hooks/data/useAuth'
import { verifyToken } from '@/services/auth'

import {
  useUserProfile,
  useAllUsersProfile,
  useDeleteUser,
  useToggleUserBlock
} from '@/hooks/data/useUser'
import { IUser } from '@/types/globals'
import { useQueryClient } from '@tanstack/react-query'

type AdminTheme = 'light' | 'dark'

interface IAuthContextData {
  adminTheme: AdminTheme
  isUserLogged: boolean
  user: {
    data: IUser | undefined
    isLoading: boolean
    error: Error | null
  }
  users: {
    data: IUser[] | undefined
    isLoading: boolean
    error: Error | null
  }
  isUserOperationsLoading: boolean
  handleLogin: (credentials: {
    email: string
    password: string
  }) => Promise<boolean>
  handleRegister: (userData: {
    name: string
    email: string
    password: string
  }) => Promise<boolean>
  handleRegisterAccess: (userData: {
    email: string
    role: string
  }) => Promise<boolean>
  handleLogout: () => void
  handleDeleteUser: (userId: string) => Promise<void>
  handleToggleUserBlock: (userId: string, blockStatus: boolean) => Promise<void>
}

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()

  const [isUserLogged, setIsUserLogged] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<IUser | null>(null)
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null)

  const [isUserOperationsLoading, setIsUserOperationsLoading] =
    useState<boolean>(false)

  const adminTheme: AdminTheme = 'light'

  const { mutateAsync: registerAccess } = useRegisterAccess()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: login } = useLogin()

  const userData = useUserProfile(user?.id)
  const usersData = useAllUsersProfile(
    isUserLogged && (user?.role === 'admin' || user?.role === 'super_admin')
  )

  const { mutateAsync: deleteUser } = useDeleteUser()
  const { mutateAsync: toggleUserBlock } = useToggleUserBlock()

  const handleLogin = async (credentials: {
    email: string
    password: string
  }) => {
    try {
      const response = await login(credentials)
      const { token } = response
      const decodedToken: any = jwtDecode(token)
      setTokenExpiration(decodedToken.exp * 1000)

      await verifyCurrentUser(token)

      localStorage.setItem('token', token)
      localStorage.setItem(
        'tokenExpiration',
        (decodedToken.exp * 1000).toString()
      )
      setToken(token)
      setIsUserLogged(true)

      toast('Sucesso! Seja bem-vindo')
      return true
    } catch (error: any) {
      console.error('Falha ao realizar login', error)
      toast(error.message)
      return false
    }
  }

  const handleRegister = async (userData: {
    name: string
    email: string
    password: string
  }) => {
    try {
      const response = await register(userData)
      const { token } = response
      const decodedToken: any = jwtDecode(token)
      setTokenExpiration(decodedToken.exp * 1000)

      await verifyCurrentUser(token)

      localStorage.setItem('token', token)
      localStorage.setItem(
        'tokenExpiration',
        (decodedToken.exp * 1000).toString()
      )
      setToken(token)
      setIsUserLogged(true)

      toast('Sucesso! Seja bem-vindo')
      return true
    } catch (error: any) {
      console.error('Falha ao realizar cadastro', error)
      toast(error.message)
      return false
    }
  }

  const handleRegisterAccess = async (userData: {
    email: string
    role: string
  }) => {
    try {
      await registerAccess(userData)
      queryClient.invalidateQueries({ queryKey: ['usersProfiles'] })
      toast('Sucesso! Novo acesso registrado')
      return true
    } catch (error: any) {
      console.error('Falha ao registrar novo acesso', error)
      toast(error.message)
      return false
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    setTokenExpiration(null)
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    setIsUserLogged(false)
  }

  const verifyCurrentUser = async (token: string) => {
    try {
      const response = await verifyToken(token)
      setUser(response)
    } catch (error) {
      console.error('Falha na verificação do Token', error)
      handleLogout()
    }
  }

  const checkTokenValidity = () => {
    const storedToken = localStorage.getItem('token')
    const storedExpiration = localStorage.getItem('tokenExpiration')

    if (storedToken && storedExpiration) {
      const expirationTime = parseInt(storedExpiration)
      const currentTime = Date.now()

      if (currentTime > expirationTime) {
        handleLogout()
      } else {
        setToken(storedToken)
        setTokenExpiration(expirationTime)
        verifyCurrentUser(storedToken)
        setIsUserLogged(true)
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      toast('Você não pode deletar sua própria conta')
      return
    }

    try {
      setIsUserOperationsLoading(true)
      await deleteUser({ userId })
      queryClient.invalidateQueries({ queryKey: ['usersProfiles'] })
      toast('Usuário deletado com sucesso')
    } catch (error: any) {
      console.error('Falha ao deletar usuário', error)
      toast(error.message || 'Erro ao deletar usuário')
    } finally {
      setIsUserOperationsLoading(false)
    }
  }

  const handleToggleUserBlock = async (
    userId: string,
    blockStatus: boolean
  ) => {
    if (userId === user.id) {
      toast('Você não pode alterar o status de bloqueio da sua própria conta')
      return
    }

    try {
      setIsUserOperationsLoading(true)
      await toggleUserBlock({ userId, blockStatus })
      queryClient.invalidateQueries({ queryKey: ['usersProfiles'] })
      const action = blockStatus ? 'bloqueado' : 'desbloqueado'
      toast(`Usuário ${action} com sucesso`)
    } catch (error: any) {
      console.error('Falha ao alterar status de bloqueio do usuário', error)
      toast(error.message || 'Erro ao alterar status de bloqueio do usuário')
    } finally {
      setIsUserOperationsLoading(false)
    }
  }

  useEffect(() => {
    checkTokenValidity()

    const interval = setInterval(() => {
      const currentTime = Date.now()
      if (tokenExpiration && currentTime > tokenExpiration) {
        handleLogout()
      } else if (token) {
        verifyCurrentUser(token)
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [token, tokenExpiration])

  const AuthContextData: IAuthContextData = useMemo(() => {
    return {
      adminTheme,
      isUserLogged,
      user: {
        data: userData.data,
        isLoading: userData.isLoading,
        error: userData.error
      },
      users: {
        data: usersData.data,
        isLoading: usersData.isLoading,
        error: usersData.error
      },
      isUserOperationsLoading:
        isUserOperationsLoading || userData.isLoading || usersData.isLoading,
      handleLogin,
      handleRegister,
      handleRegisterAccess,
      handleLogout,
      handleDeleteUser,
      handleToggleUserBlock
    }
  }, [
    adminTheme,
    isUserLogged,
    user,
    userData,
    usersData,
    isUserOperationsLoading
  ])

  return (
    <AuthContext.Provider value={AuthContextData}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth precisa estar dentro de um AuthProvider')
  return context
}

export { AuthProvider, useAuth }
