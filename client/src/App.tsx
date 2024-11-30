import { useMemo } from 'react'

import AppRoutes from '@/Routes'

import { ConfigProvider, theme } from 'antd'

import { AuthProvider, useAuth } from '@/contexts/AuthProvider'

function App() {
  const { adminTheme } = useAuth()

  const themeSelected = useMemo(() => {
    return adminTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  }, [adminTheme])

  return (
    <AuthProvider>
      <ConfigProvider
        theme={{
          algorithm: themeSelected,
          token: {
            colorPrimary: '#FF7A00'
          }
        }}
      >
        <AppRoutes />
      </ConfigProvider>
    </AuthProvider>
  )
}

export default App
