const bcrypt = require("bcryptjs");
const { User } = require("../database/models");

class UserService {
  async createUser(userData) {
    const { name, email, password, role } = userData;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "couple",
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async authenticateUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAllUsers() {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    return users;
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "createdAt"],
    });
    return user;
  }
}

module.exports = new UserService();