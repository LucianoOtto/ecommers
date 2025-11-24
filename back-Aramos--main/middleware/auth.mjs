import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json("Token requerido");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch {
    res.status(401).json("Token inválido");
  }
};