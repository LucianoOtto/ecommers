import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Product = sequelize.define("Product", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  image_url: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'products',
  timestamps: true
});

export default Product;