import Cart from "../models/Cart.mjs";
import Product from "../models/Product.mjs";

export const agregarAlCarrito = async (req, res) => {
  const { productoId, cantidad } = req.body;

  try {
    const producto = await Product.findByPk(productoId);
    if (!producto) return res.status(404).json({ mensaje: "Producto inexistente" });

    const item = await Cart.create({
      usuarioId: req.user.id,
      productoId,
      cantidad
    });

    res.json({ mensaje: "Producto agregado al carrito", item });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar al carrito" });
  }
};

export const verCarrito = async (req, res) => {
  try {
    const items = await Cart.findAll({
      where: { usuarioId: req.user.id },
      include: Product
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener carrito" });
  }
};

export const confirmarCompra = async (req, res) => {
  try {
    await Cart.destroy({ where: { usuarioId: req.user.id } });
    res.json({ mensaje: "Compra confirmada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al confirmar compra" });
  }
};