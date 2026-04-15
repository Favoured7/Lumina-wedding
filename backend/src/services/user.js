import sequelize from "../database/db.js";
import { DataTypes } from "sequelize";

// Define User model
const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING }
  },
  {
    tableName: "users",
    timestamps: false
  }
);

// Service function
export const fetchUsers = async () => {
  return await User.findAll();
};
