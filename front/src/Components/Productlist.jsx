import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStore } from '../Store/useStore';
import { Loader2, Trash2, Plus, Edit, Image as ImageIcon } from 'lucide-react';

const DeleteConfirmationModal = ({ show, onConfirm, onCancel, productName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-purple-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trash2 className="w-5 h-5 mr-2 text-red-500" />
          Confirmar Eliminación
        </h2>
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar el producto <br />
          <strong className="font-bold text-purple-300">{productName}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const Productlist = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const DEBUG_IS_ADMIN = false; 
  const isAdmin = (user && user.token) || DEBUG_IS_ADMIN;

  const API_BASE_URL = import.meta.env.VITE_API_URL

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    
    const headers = {};
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/products`);
      
      const response = await fetch(`${API_BASE_URL}/api/products`, { 
        headers,
        method: 'GET'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo conectar a la API.`);
      }

      const data = await response.json();
      console.log('Productos recibidos:', data);
      
      // Intentar extraer el array de productos
      let productosArray = [];
      
      if (Array.isArray(data)) {
        productosArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productosArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productosArray = data.data;
      } else if (data.productos && Array.isArray(data.productos)) {
        productosArray = data.productos;
      } else {
        console.error('Formato inesperado:', data);
        productosArray = [];
      }
      
      setProductos(productosArray);
      
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminarClick = (producto) => {
    setProductToDelete(producto);
    setShowDeleteModal(true);
  };

  const eliminarProductoConfirmado = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto.');
      }

      fetchProductos();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleImageError = (productoId) => {
    setImageErrors(prev => ({
      ...prev,
      [productoId]: true
    }));
  };

  const getImageUrl = (producto) => {
    // Si tiene una URL completa
    if (producto.image_url && producto.image_url.startsWith('http')) {
      return producto.image_url;
    }
    // Si es una ruta relativa
    if (producto.image_url) {
      return `${API_BASE_URL}${producto.image_url}`;
    }
    // Campos alternativos
    if (producto.image) {
      return producto.image.startsWith('http') ? producto.image : `${API_BASE_URL}${producto.image}`;
    }
    if (producto.imagen) {
      return producto.imagen.startsWith('http') ? producto.imagen : `${API_BASE_URL}${producto.imagen}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="text-white text-center p-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-2 text-purple-300">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-800/20 text-red-300 rounded-xl m-6 border border-red-700">
        <p className="font-semibold mb-2">Error de Carga</p>
        <p>{error}</p>
        <button 
          onClick={fetchProductos} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        
        {isAdmin && (
          <Link 
            to="/private/productos/nuevo"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        )}
      </div>

      {productos.length === 0 ? (
        <div className="mt-8 bg-white/5 p-8 rounded-xl text-center border border-white/10">
          <p className="text-white text-lg mb-4">No hay productos cargados en la base de datos.</p>
          {isAdmin && (
            <Link
              to="/private/productos/nuevo"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              + Agregar primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {productos.map(producto => {
            const imageUrl = getImageUrl(producto);
            const hasImageError = imageErrors[producto.id];
            
            return (
              <div key={producto.id} className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20 flex flex-col sm:flex-row">
                {/* Imagen del producto */}
                <div className="sm:w-48 h-48 sm:h-auto bg-gray-800 flex-shrink-0">
                  {imageUrl && !hasImageError ? (
                    <img 
                      src={imageUrl}
                      alt={producto.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(producto.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                      <ImageIcon className="w-16 h-16 text-purple-300 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="flex-1 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-3 sm:mb-0 flex-1">
                    <h3 className="text-white font-semibold text-lg">{producto.name}</h3>
                    <p className="text-purple-200 text-sm mt-1">{producto.descripcion || producto.description || 'Sin descripción'}</p>
                    <p className="text-white mt-2 font-mono">
                      Stock: {producto.stock} | Precio: ${producto.price}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link 
                        to={`/private/productos/editar/${producto.id}`}
                        className="w-1/2 sm:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminarClick(producto)}
                        className="w-1/2 sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        onConfirm={eliminarProductoConfirmado}
        onCancel={() => setShowDeleteModal(false)}
        productName={productToDelete?.name || 'este producto'}
      />
    </div>
  );
};

export default Productlist;