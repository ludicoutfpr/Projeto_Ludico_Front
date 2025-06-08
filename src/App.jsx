import { BrowserRouter } from 'react-router'
import { Router } from './Router'
import { CeremonyProvider } from './contexts/CeremonyContext'
import { UserProvider } from './contexts/AuthContext'

function App() {
  return (
    <UserProvider>
      <CeremonyProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </CeremonyProvider>
    </UserProvider>
  )
}

export default App
