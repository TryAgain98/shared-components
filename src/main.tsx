import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Button from './components/Button'
import './style.css'
import { ComponentsProvider } from './store/provider'
import { MapStage } from './components/MapStage'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComponentsProvider>
      <div>
        <Button label="Click me" />
        <MapStage />
      </div>
    </ComponentsProvider>
  </StrictMode>,
)
