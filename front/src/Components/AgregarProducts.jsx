import { useState, useEffect } from 'react'
const STORAGE_KEY = 'encomers_products'

export const AgregarProducts = () => {
    const [products, setProducts] = useState([])
    const [form, setForm] = useState({ name: '', price: '', desc: '', image: '' })
    const [error, setError] = useState('')

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setProducts(JSON.parse(raw))
        } catch (e) {
            console.error('Error leyendo productos desde localStorage', e)
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
        } catch (e) {
            console.error('Error guardando productos en localStorage', e)
        }
    }, [products])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value })) //operador de propagacion
    }

    function handleSubmit(e) {
        e.preventDefault()
        setError('')
        if (!form.name.trim()) return setError('El nombre es requerido')
        const price = parseFloat(form.price)
        if (isNaN(price) || price < 0) return setError('Precio inválido')

        const newProduct = {
            id: Date.now().toString(),
            name: form.name.trim(),
            price: Number(price),
            desc: form.desc.trim(),
            image: form.image.trim() || 'https://via.placeholder.com/400x300',
        }

        setProducts(prev => [newProduct, ...prev])//operador de propagacion
        setForm({ name: '', price: '', desc: '', image: '' })
    }

    function handleDelete(id) {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Agregar producto</h2>

            <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input name="name" value={form.name} onChange={handleChange} className="md:col-span-2 border px-3 py-2 rounded" placeholder="Nombre del producto" />
                    <input name="price" value={form.price} onChange={handleChange} className="border px-3 py-2 rounded" placeholder="Precio (ej. 19.99)" />
                </div>
                <input name="image" value={form.image} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="URL de imagen (opcional)" />
                <textarea name="desc" value={form.desc} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Descripción corta" />

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Agregar</button>
                    <button type="button" onClick={() => setForm({ name: '', price: '', desc: '', image: '' })} className="px-4 py-2 border rounded">Limpiar</button>
                </div>
            </form>

            <section className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Productos añadidos</h3>
                {products.length === 0 ? (
                    <p className="text-gray-600">No hay productos. Añade uno con el formulario.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(p => (
                            <div key={p.id} className="bg-white rounded shadow overflow-hidden">
                                <img src={p.image} alt={p.name} className="w-full h-40 object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300'} />
                                <div className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold">{p.name}</div>
                                            <div className="text-sm text-gray-500">{p.desc}</div>
                                        </div>
                                        <div className="text-indigo-600 font-bold">${Number(p.price).toFixed(2)}</div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}