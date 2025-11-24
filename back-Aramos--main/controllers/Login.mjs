import User from "./models/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ msg: "El email ya existe" });

  const hash = await bcrypt.hash(password, 10);

  const count = await User.count(); // saber si es el primer usuario

  const user = await User.create({
    name,
    email,
    password: hash,
    isAdmin: count === 0 // El primer usuario que se registre será admin
  });

  res.json({ msg: "Usuario registrado", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ msg: "Resgitro exitoso", token });
};