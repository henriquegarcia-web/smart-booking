import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

import { useRegisterAccess, useRegister, useLogin } from '@/hooks/data/useAuth'
import { verifyToken } from '@/services/auth'
import { useAllUsersProfile } from '@/hooks/data/useUser'

interface IUser {
  id: string
  name?: string
  email: string
  blocked: boolean
  firstAccess: boolean
  role: string
}

type AdminTheme = 'light' | 'dark'

export interface IAuthContextData {
  isUserLogged: boolean
  user: IUser | null
  adminTheme: AdminTheme
  allUsers: IUser[]
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
}

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<IUser | null>(null)
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null)

  const adminTheme: AdminTheme = 'light'

  const { mutateAsync: registerAccess } = useRegisterAccess()
  const { mutateAsync: register } = useRegister()
  const { mutateAsync: login } = useLogin()

  const { data: usersProfilesData, isSuccess: isUsersProfilesSuccess } =
    useAllUsersProfile()

  const handleLogin = async (credentials: {
    email: string
    password: string
  }) => {
    try {
      const response = await login(credentials)
      const { token } = response
      // console.log(token)
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
      // console.log(token)
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
      setIsUserLogged(true)

      toast('Sucesso! Seja bem-vindo')
      return true
    } catch (error: any) {
      console.error('Falha ao realizar cadastro', error)
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
      setUser({
        id: response.userId,
        ...response
      })
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

  useEffect(() => {
    if (isUsersProfilesSuccess && usersProfilesData) {
      setAllUsers(usersProfilesData)
    }
  }, [isUsersProfilesSuccess, usersProfilesData])

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
  }, [token, tokenExpiration, allUsers])

  const AuthContextData: IAuthContextData = useMemo(() => {
    return {
      isUserLogged,
      user,
      adminTheme,
      allUsers,
      handleLogin,
      handleRegister,
      handleRegisterAccess,
      handleLogout
    }
  }, [isUserLogged, user, adminTheme, allUsers])

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
