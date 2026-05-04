const userService = require("../services/userService");
const sessionService = require('../services/sessionService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;
      const user = await userService.createUser({ name, email, password, phone, role });
      
      // Create token using session service
      const token = sessionService.createToken(user);
      
      res.status(201).json({ 
        success: true, 
        message: "Registration successful", 
        user,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.authenticateUser(email, password);
      
      // Create token using session service
      const token = sessionService.createToken(result.user);
      
      res.json({ 
        success: true, 
        message: "Login successful", 
        token: token,
        user: result.user
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Get current user profile
  async getMe(req, res) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }
      
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Verify session token
  async verifySession(req, res) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.json({ 
        success: false, 
        valid: false, 
        message: 'No session found' 
      });
    }
    
    const session = sessionService.validateSession(token);
    
    res.json({
      success: session.valid,
      valid: session.valid,
      user: session.user || null,
      message: session.message
    });
  }

  // Logout user
  async logout(req, res) {
    // Client will remove the token
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  }
}

module.exports = new AuthController();