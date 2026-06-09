import React from 'react'
import ReactDOM from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'

import App from './App'
import config from './tamagui.config'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TamaguiProvider config={config} defaultTheme="light">
      <App />
    </TamaguiProvider>
  </React.StrictMode>,
)
