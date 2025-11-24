import User from "./User.mjs";
import Product from "./Product.mjs";
import Cart from "./Cart.mjs";
import CartItem from "./CartItem.mjs";

// Usuario - Producto
User.hasMany(Product, { foreignKey: "UserId" });
Product.belongsTo(User, { foreignKey: "UserId" });

// Usuario - Carrito (especifica UserId)
User.hasOne(Cart, { foreignKey: "UserId" });
Cart.belongsTo(User, { foreignKey: "UserId" });

// Carrito - Producto (Many-to-Many)
Cart.belongsToMany(Product, { through: CartItem, foreignKey: "CartId" });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: "ProductId" });

export { User, Product, Cart, CartItem };