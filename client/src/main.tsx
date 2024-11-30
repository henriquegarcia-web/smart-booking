import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import GlobalStyle from './utils/styles/globals.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 4 * 1000,
      // refetchInterval: 4 * 1000
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <GlobalStyle />

    <App />
  </QueryClientProvider>
)
