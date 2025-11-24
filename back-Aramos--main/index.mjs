import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sequelize  from "./config/db.mjs";

// Rutas
import authRoutes from "./routes/authRoutes.mjs";
import productRoutes from "./routes/productRoutes.mjs";
import cartRoutes from "./routes/cartRoutes.mjs";

// Cargar variables de entorno
dotenv.config();

// Obtener ruta absoluta del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear servidor
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir imágenes de productos
app.use("/imagenes", express.static(path.join(process.cwd(), "cargas")));

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.json("API funcionando correctamente");
});

// Inicializar servidor
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada correctamente");

    await sequelize.sync();
    console.log("Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
