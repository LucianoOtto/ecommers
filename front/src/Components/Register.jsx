import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStore } from '../Store/useStore'
import {Input} from './Input'
import Form from './Form'
import Button from './Button'

const AgregarProducts = () => {
  const navigate = useNavigate()
  const { user } = useStore()
  const [loading, setLoading] = useState(false)
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (!name.trim()) {
        toast.error('El nombre es requerido')
        setLoading(false)
        return
      }

      const priceNum = parseFloat(price)
      if (isNaN(priceNum) || priceNum < 0) {
        toast.error('El precio debe ser un número válido')
        setLoading(false)
        return
      }

      const stockNum = parseInt(stock)
      if (isNaN(stockNum) || stockNum < 0) {
        toast.error('El stock debe ser un número válido')
        setLoading(false)
        return
      }

      // Preparar datos
      const body = {
        name: name.trim(),
        price: priceNum,
        stock: stockNum,
        descripcion: descripcion.trim() || 'Sin descripción',
        image_url: imageUrl.trim() || 'https://via.placeholder.com/400x300'
      }

      // Enviar al backend
      const url = `${import.meta.env.VITE_API_URL}/api/products`
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
        toast.error(res.message || 'Error al crear el producto')
        setLoading(false)
        return
      }

      toast.success('Producto creado exitosamente')

      // Limpiar formulario
      setName('')
      setPrice('')
      setStock('')
      setDescripcion('')
      setImageUrl('')

      // Redirigir a la lista de productos
      setTimeout(() => {
        navigate('/private/productos')
      }, 1000)

    } catch (err) {
      toast.error('Error al crear el producto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Agregar Nuevo Producto</h1>
          <p className="text-purple-300">Completa los campos para agregar un producto al inventario</p>
        </div>

        <Form title="" onSubmit={handleSubmit}>
          <Input
            name="name"
            type="text"
            id="name"
            title="Nombre del Producto"
            placeholder="Ej: Laptop Dell Inspiron"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="price"
              type="number"
              id="price"
              title="Precio"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              required
            />

            <Input
              name="stock"
              type="number"
              id="stock"
              title="Stock"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />
          </div>

          <Input
            name="imageUrl"
            type="url"
            id="imageUrl"
            title="URL de Imagen (opcional)"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="text-white font-medium">
              Descripción
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              placeholder="Descripción del producto..."
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              value={loading ? "Guardando..." : "Crear Producto"}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => navigate('/private/productos')}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </Form>

        {/* Vista previa opcional */}
        {(name || price || imageUrl) && (
          <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Vista Previa</h3>
            <div className="bg-white/5 rounded-lg overflow-hidden">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="text-white font-bold text-lg">{name || 'Nombre del producto'}</h4>
                <p className="text-purple-200 text-sm mt-1">{descripcion || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-white font-mono text-lg">${price || '0.00'}</span>
                  <span className="text-purple-300">Stock: {stock || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgregarProducts