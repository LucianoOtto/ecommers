import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Carts',
      key: 'id'
    }
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  cantidad: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'CartItems'
});

export default CartItem;