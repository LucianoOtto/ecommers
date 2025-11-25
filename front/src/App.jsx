import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Public from './Pages/Public'
import Private from './Pages/Private'
import "react-toastify/dist/ReactToastify.css"
import  AgregarProducts  from './Components/AgregarProducts'
import Register from './Components/Register'
import Login from './Components/Login'
import Productlist from './Components/Productlist'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Public />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Rutas privadas */}
        <Route path="/private" element={<Private />}>
          <Route path="agregar-productos" element={<AgregarProducts />} />
          <Route path='productos' element={<Productlist/>}/>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen bg-gray-900">
            <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">📦 Encomer</h1>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold">404 - Página no encontrada</h1>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
