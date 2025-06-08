import { Routes, Route } from 'react-router'
import { Login } from './pages/Login'
import { Ceremony } from './pages/Ceremony'
import { ManageCeremony } from './pages/Ceremony/ManageCeremony'
import { ExecuteCeremony } from './pages/Ceremony/ExecuteCeremony'
import { Admin } from './pages/Admin'
import { Scape } from './pages/Scape'
import { BoardGames } from './pages/BoardGames'
import { RPG } from './pages/RPG'
import { Navigate } from 'react-router'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}


export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Ceremony" element={
        <PrivateRoute>
          <Ceremony />
        </PrivateRoute>
      } />
      <Route path="/Ceremony/create" element={
        <PrivateRoute>
          <ManageCeremony />
        </PrivateRoute>
      } />
      <Route path="/Ceremony/:id" element={
        <PrivateRoute>
          <ManageCeremony />
        </PrivateRoute>
      } />
      <Route path="/Ceremony/:id/execute" element={
        <PrivateRoute>
          <ExecuteCeremony />
        </PrivateRoute>
      } />
      <Route path="/Scape/" element={
        <PrivateRoute>
          <Scape />
        </PrivateRoute>
      } />
      <Route path="/BoardGame/" element={
        <PrivateRoute>
          <BoardGames />
        </PrivateRoute>
      } />
      <Route path="/RPG" element={
        <PrivateRoute>
          <RPG />
        </PrivateRoute>
      } />
      <Route path="/Admin" element={
        <PrivateRoute>
          <Admin />
        </PrivateRoute>
      } />
    </Routes>
  )
}