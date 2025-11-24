import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../Store/useStore'
import { LogOut, User, LogIn, Package } from 'lucide-react'

const Nav = () => {
  const { user, setUser } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser({
      full_name: null,
      token: null,
      email: null
    })
    navigate('/')
  }

  return (
    <nav className="bg-pink-800/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-purple-300 transition-colors"
          >
            <Package className="w-6 h-6" />
            Stock Manager
          </Link>

          {/* Botones de navegación */}
          <div className="flex items-center gap-3">
            {user && user.token ? (
              <>
                {/* Usuario logueado */}
                <div className="hidden sm:flex items-center gap-2 text-purple-200 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user.full_name || user.email}</span>
                </div>
                
                <Link
                  to="/private/productos"
                  className="px-4 py-2 text-white hover:text-purple-300 transition-colors font-medium"
                >
                  Mis Productos
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                {/* Usuario no logueado */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-purple-300 transition-colors font-medium flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav