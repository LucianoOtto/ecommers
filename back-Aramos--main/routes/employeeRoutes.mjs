import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.mjs";
import { auth } from "../middleware/auth.mjs";
import { requiereRol } from "../middleware/roles.mjs";

const router = express.Router();

router.post("/",
  auth,
  requiereRol(["admin"]),
  async (req, res) => {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(400).json("El email ya está registrado");

    await User.create({
      nombre,
      email,
      rol: "empleado",
      password: await bcrypt.hash(password, 10)
    });

    res.json("Empleado creado");
  }
);

export default router;