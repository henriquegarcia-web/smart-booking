import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { SignInScreen, SignUpScreen, DashboardScreen } from '@/screens'

import { useAuth } from '@/contexts/AuthProvider'

const AppRoutes = () => {
  const { isUserLogged } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* =============================================================== */}

        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="*" element={<Navigate to="/admin" />} />

        {/* =============================================================== */}

        <Route
          path="/entrar"
          element={
            <PublicRoute isAuthenticated={isUserLogged}>
              <SignInScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/cadastrar"
          element={
            <PublicRoute isAuthenticated={isUserLogged}>
              <SignUpScreen />
            </PublicRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute isAuthenticated={isUserLogged}>
              <DashboardScreen />
            </PrivateRoute>
          }
        />

        <Route path="/dashboard" element={<DashboardScreen />} />
        {/* =============================================================== */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

// =========================================== ROUTES

interface RouteProps {
  isAuthenticated: boolean
  children: React.ReactNode
}

const PrivateRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />
  }

  return children
}

const PublicRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/playground" />
  }

  return children
}
