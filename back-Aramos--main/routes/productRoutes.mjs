import express from "express";
import { auth } from "../middleware/auth.mjs";
import { requiereRol } from "../middleware/roles.mjs";
import Product from "../models/Product.mjs";
import multer from "multer";
import fs from "node:fs";
import { v4 as uuid } from "uuid";

const router = express.Router();
const upload = multer();

// Obtener todos los productos
router.get("/", async (req, res) => {
  const productos = await Product.findAll({
    include: {
      association: "User",
      attributes: ["id", "nombre", "email", "rol"]
    }
  });

  res.json(productos);
});

// Crear un producto (admin o empleado)
router.post("/",
  auth,
  requiereRol(["admin", "empleado"]),
  upload.single("imagen"),
  async (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    let nombreImagen = null;

    if (req.file) {
      if (!fs.existsSync("cargas")) fs.mkdirSync("cargas");
      nombreImagen = uuid() + ".jpg";
      fs.writeFileSync(`cargas/${nombreImagen}`, req.file.buffer);
    }

    const producto = await Product.create({
      nombre,
      descripcion,
      precio,
      imagen: nombreImagen,
      UserId: req.user.id   // Relación aquí
    });

    res.json(producto);
  }
);

// Editar producto (admin o creador)
router.put("/:id",
  auth,
  requiereRol(["admin", "empleado"]),
  upload.single("imagen"),
  async (req, res) => {
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).json("Producto no encontrado");

    // Solo admin o creador
    if (req.user.rol !== "admin" && producto.UserId !== req.user.id)
      return res.status(403).json("No autorizado para editar este producto");

    let nombreImagen = producto.imagen;

    if (req.file) {
      if (!fs.existsSync("cargas")) fs.mkdirSync("cargas");

      // Borrar imagen anterior si existía
      if (nombreImagen && fs.existsSync(`cargas/${nombreImagen}`)) {
        fs.unlinkSync(`cargas/${nombreImagen}`);
      }

      nombreImagen = uuid() + ".jpg";
      fs.writeFileSync(`cargas/${nombreImagen}`, req.file.buffer);
    }

    await producto.update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: nombreImagen
    });

    res.json("Producto actualizado");
  }
);

// Eliminar producto (admin o creador)
router.delete("/:id",
  auth,
  requiereRol(["admin", "empleado"]),
  async (req, res) => {
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).json("Producto no encontrado");

    if (req.user.rol !== "admin" && producto.UserId !== req.user.id)
      return res.status(403).json("No autorizado para eliminar este producto");
    if (producto.imagen && fs.existsSync(`cargas/${producto.imagen}`)) {
      fs.unlinkSync(`cargas/${producto.imagen}`);
    }

    await producto.destroy();
    res.json("Producto eliminado");
  }
);

export default router;
