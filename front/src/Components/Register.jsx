
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStore } from '../Store/useStore'
import Input from './Input'
import Form from './Form'
import Button from './Button'

const Register = () => {
  const navigate = useNavigate()
  const { user } = useStore()
  const [loading, setLoading] = useState(false)
  
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!nombreCompleto.trim()) {
        toast.error('El nombre completo es requerido')
        setLoading(false)
        return
      }

      if (!email.trim()) {
        toast.error('El email es requerido')
        setLoading(false)
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('El formato del email no es válido')
        setLoading(false)
        return
      }

      if (!password) {
        toast.error('La contraseña es requerida')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden')
        setLoading(false)
        return
      }

      // Preparar datos
      const body = {
        nombre_completo: nombreCompleto.trim(),
        email: email.trim().toLowerCase(),
        password: password
      }

      // Enviar al backend
      const url = `${import.meta.env.VITE_API_URL}/api/auth/register`
      const req = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      })

      const res = await req.json()

      if (!req.ok) {
        toast.error(res.message || 'Error al registrar el usuario')
        setLoading(false)
        return
      }

      toast.success('Usuario registrado exitosamente')

      // Limpiar formulario
      setNombreCompleto('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirigir a la lista de usuarios
      setTimeout(() => {
        navigate('/private/usuarios')
      }, 1000)

    } catch (err) {
      toast.error('Error al registrar el usuario')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Registrar Nuevo Usuario</h1>
          <p className="text-purple-300">Completa los campos para crear una nueva cuenta de usuario</p>
        </div>

        <Form title="" onSubmit={handleSubmit}>
          <Input
            name="nombreCompleto"
            type="text"
            id="nombreCompleto"
            title="Nombre Completo"
            placeholder="Ej: Juan Pérez"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />

          <Input
            name="email"
            type="email"
            id="email"
            title="Email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            name="password"
            type="password"
            id="password"
            title="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            title="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              value={loading ? "Registrando..." : "Registrar Usuario"}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => navigate('/private/usuarios')}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </Form>

        {/* Vista previa opcional */}
        {(nombreCompleto || email) && (
          <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Vista Previa</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{nombreCompleto || 'Nombre del usuario'}</h4>
                  <p className="text-purple-200 text-sm">{email || 'email@ejemplo.com'}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${password.length >= 6 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {password.length >= 6 ? '✓ Contraseña válida' : 'Contraseña débil'}
                    </span>
                    {password && confirmPassword && (
                      <span className={`text-xs px-2 py-1 rounded ${password === confirmPassword ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {password === confirmPassword ? '✓ Contraseñas coinciden' : '✗ Contraseñas no coinciden'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register