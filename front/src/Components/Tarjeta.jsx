import { ShoppingCart } from 'lucide-react';

export const Tarjeta = ({ 

    


}) => {
  return (
    <div className="w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden bg-amber-50 h-64">
        <img 
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Nuevo
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Nombre del producto */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {nombre}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {descripcion}
        </p>

        {/* Precio y botón */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-3xl font-bold text-amber-700">
              ${precio}
            </span>
          </div>
          
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 font-semibold">
            <ShoppingCart size={20} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso con múltiples productos
function App() {
  const productos = [
    {
      imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      nombre: "Reloj Clásico",
      descripcion: "Elegante reloj de pulsera con correa de cuero genuino",
      precio: 89.99
    },
    {
      imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      nombre: "Gafas de Sol Premium",
      descripcion: "Protección UV400 con diseño moderno y sofisticado",
      precio: 129.99
    },
    {
      imagen: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
      nombre: "Zapatillas Deportivas",
      descripcion: "Comodidad y estilo para tu día a día",
      precio: 149.99
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">
          Productos Destacados
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {productos.map((producto, index) => (
            <Tarjeta key={index} {...producto} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;