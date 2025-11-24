import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'completado', 'abandonado'),
    defaultValue: 'activo'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
}, {
  timestamps: true,
  tableName: 'Carts'
});

export default Cart;