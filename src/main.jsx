import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ClearPath from './ClearPath.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClearPath />
  </StrictMode>
)
