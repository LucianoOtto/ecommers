import { Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../Store/useStore'
import { useEffect, useState } from 'react'
import Nav from '../Components/Nav'

function Private() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    async function verifyAuth() {
      // Si no hay token, redirigir al login
      if (!user?.token) {
        navigate("/login")
        setIsVerifying(false)
        return
      }

      try {
        // Verificar que el token sea válido
        const url = `${import.meta.env.VITE_API_URL}/api/auth/verify-token`
        const config = {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${user.token}`
          }
        }

        const req = await fetch(url, config)
        const res = await req.json()

        if (res.error) {
          // Token inválido, cerrar sesión y redirigir
          setUser({
            full_name: null,
            token: null,
            email: null
          })
          navigate("/login")
          return
        }

        // Token válido, continuar
        setIsVerifying(false)
      } catch (error) {
        console.error('Error verificando token:', error)
        setUser({
          full_name: null,
          token: null,
          email: null
        })
        navigate("/login")
      }
    }

    verifyAuth()
  }, [user?.token, navigate, setUser])

  // Mientras verifica, mostrar loader
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-pink-200/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <div className="space-y-1">
              <p className="text-white font-semibold text-lg">Verificando acceso</p>
              <p className="text-purple-200 text-sm">Por favor espera...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Contenido */}
      <div className="relative z-10">
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Private