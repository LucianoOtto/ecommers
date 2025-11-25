import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Product = sequelize.define("Product", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  imagen: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'products',
  timestamps: true
});

export default Product;