import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import GlobalStyle from './utils/styles/globals.ts'

import { TemplateProvider } from '@/contexts/TemplateProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TemplateProvider>
      <GlobalStyle />
      <App />
    </TemplateProvider>
  </React.StrictMode>
)
