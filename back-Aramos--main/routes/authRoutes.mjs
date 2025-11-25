import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const router = express.Router();

// Registro (primer usuario = admin)
router.post("/register", async (req, res) => {
  try {
    const { nombre_completo, email, password } = req.body; // 👈 Cambio aquí

    // Validaciones
    if (!nombre_completo || !email || !password) {
      return res.status(400).json({ 
        error: true, 
        message: "Todos los campos son requeridos" 
      });
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ 
        error: true, 
        message: "El email ya está registrado" 
      });
    }

    const total = await User.count();
    const rol = total === 0 ? "admin" : "usuario";

    const user = await User.create({
      nombre: nombre_completo, // 👈 Mapear nombre_completo a nombre
      email,
      password: await bcrypt.hash(password, 10),
      rol
    });

    res.status(201).json({ 
      error: false,
      message: `Usuario creado como ${rol}`,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: true, 
      message: "Error al registrar usuario",
      details: error.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: true, 
        message: "Email y contraseña son requeridos" 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: "Usuario no encontrado" 
      });
    }

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(400).json({ 
        error: true, 
        message: "Contraseña incorrecta" 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      error: false,
      token,
      rol: user.rol,
      nombre: user.nombre,
      email: user.email
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: true, 
      message: "Error al iniciar sesión",
      details: error.message 
    });
  }
});

export default router;