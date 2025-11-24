import { useState } from "react"
import { toast } from "react-toastify"
import { Input } from "./Input"
import { Link, useNavigate } from 'react-router-dom'
import Form from "./Form"
import Button from "./Button"

const LoginLegend = () => {
    return (
        <p className="text-gray-600">
            ¿No tenes cuenta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
                registrate
            </Link>
        </p>
    )
}

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const body = { email, password }
            const url = `${import.meta.env.VITE_API_URL}/api/auth/login`
            
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            
            const res = await req.json()

            if (!req.ok) {
                toast.error(res.message || "Error al iniciar sesión")
                return
            }
            
            localStorage.setItem('user', JSON.stringify({
                email,
                token: res.token,
                full_name: res.user?.fullName || email  
            }))
            
            toast.success("Sesión iniciada")
            navigate('/private/productos')

        } catch (error) {
            toast.error("Error al iniciar sesión")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form title="Iniciar Sesión" Legend={LoginLegend} onSubmit={handleSubmit}>
            <Input
                type="email"
                id="email"
                name="email"
                title="Email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                title="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                type='submit'
                value={loading ? "Iniciando..." : "Iniciar Sesión"}
                disabled={loading}
            />
        </Form>
    )
}

export default Login