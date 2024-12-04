import { useMemo } from 'react'

import AppRoutes from '@/Routes'

import { ConfigProvider, theme } from 'antd'

import { AuthProvider, useAuth } from '@/contexts/AuthProvider'
import { FilterProvider } from './contexts/FilterProvider'

function App() {
  const { adminTheme } = useAuth()

  const themeSelected = useMemo(() => {
    return adminTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  }, [adminTheme])

  return (
    <AuthProvider>
      <FilterProvider>
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
      </FilterProvider>
    </AuthProvider>
  )
}

export default App
