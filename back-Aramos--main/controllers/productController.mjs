import fs from "node:fs";
import Product from "../models/Product.mjs";
import { v4 as uuid } from "uuid";

export const listarProductos = async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const crearProducto = async (req, res) => {
  const { nombre, precio, descripcion } = req.body;

  try {
    const archivo = req.file;

    if (!archivo) return res.status(400).json({ mensaje: "Imagen requerida" });

    if (!fs.existsSync(`${process.cwd()}/cargas`)) {
      fs.mkdirSync(`${process.cwd()}/cargas`);
    }

    const nombreImagen = uuid() + ".jpg";
    fs.writeFileSync(`${process.cwd()}/cargas/${nombreImagen}`, archivo.buffer);

    const nuevo = await Product.create({
      nombre,
      precio,
      descripcion,
      imagen: nombreImagen,
      usuarioId: req.user.id
    });

    res.json({ mensaje: "Producto creado", producto: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Product.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto inexistente" });

    const datos = req.body;

    if (req.file) {
      const nombreImagen = uuid() + ".jpg";
      fs.writeFileSync(`${process.cwd()}/cargas/${nombreImagen}`, req.file.buffer);
      datos.imagen = nombreImagen;
    }

    await producto.update(datos);

    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Product.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto inexistente" });

    await producto.destroy();

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
};
