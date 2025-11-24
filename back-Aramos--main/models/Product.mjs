import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  precio: DataTypes.FLOAT,
  imagen: DataTypes.STRING
});

export default Product;