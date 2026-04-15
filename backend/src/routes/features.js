import express from "express";
import { getUsers } from "../controller/user.js";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);

export default userRoutes;