import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/app'
import reportWebVitals from './reportWebVitals'
import { PrefecturesProvider } from './contexts/prefectureContext'
import { LabelProvider } from './contexts/labelContext'
import { PopulationProvider } from './contexts/populationContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <PrefecturesProvider>
      <LabelProvider>
        <PopulationProvider>
          <App />
        </PopulationProvider>
      </LabelProvider>
    </PrefecturesProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
