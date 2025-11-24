import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const router = express.Router();

// Registro (primer usuario = admin)
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  const existe = await User.findOne({ where: { email } });
  if (existe) return res.status(400).json("El email ya está registrado");

  const total = await User.count();
  const rol = total === 0 ? "admin" : "usuario";

  const user = await User.create({
    nombre,
    email,
    password: await bcrypt.hash(password, 10),
    rol
  });

  res.json(`Usuario creado como ${rol}`);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json("Usuario no encontrado");

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) return res.status(400).json("Contraseña incorrecta");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({
    token,
    rol: user.rol,
    nombre: user.nombre
  });
});

export default router;