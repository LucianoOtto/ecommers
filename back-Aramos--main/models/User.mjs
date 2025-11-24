import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const User = sequelize.define("User", {
id: { type: DataTypes.INTEGER,
     primaryKey: true, 
     autoIncrement: true },
nombre: { type: DataTypes.STRING, 
    allowNull: false },
email: { type: DataTypes.STRING, 
    allowNull: false, 
    unique: true },
password: { type: DataTypes.STRING,
    allowNull: false },
rol: {
    type: DataTypes.ENUM("admin", "empleado", "usuario"),
    defaultValue: "usuario"
}
});

export default User;