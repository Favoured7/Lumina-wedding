import { fetchUsers } from "../services/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// see if you need to check the session ...