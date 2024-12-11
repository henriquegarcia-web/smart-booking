import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import GlobalStyle from './utils/styles/globals.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'dayjs/locale/pt-br'
import 'jspdf-autotable'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
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

    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
      transition={Bounce}
    />
  </QueryClientProvider>
)
