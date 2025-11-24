import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(400).json({ mensaje: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await User.create({
      nombre,
      email,
      password: hashed,
      rol: rol || "usuario"
    });

    res.json({ mensaje: "Usuario registrado", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.SECRET_JWT,
      { expiresIn: "24h" }
    );

    res.json({ mensaje: "Login correcto", token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const verifyToken = (req, res) => {
  res.json({ mensaje: "Token válido", usuario: req.user });
};

