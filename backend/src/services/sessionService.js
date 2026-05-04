const jwt = require('jsonwebtoken');

class SessionService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-super-secret-key-change-this';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  // Create JWT token for user
  createToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      uuid: user.uuid
    };
    
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }

  // Get user from token
  getUserFromToken(token) {
    const decoded = this.verifyToken(token);
    if (decoded) {
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        uuid: decoded.uuid
      };
    }
    return null;
  }

  // Check if token is expired
  isTokenExpired(token) {
    const decoded = this.verifyToken(token);
    if (!decoded) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  // Refresh token
  refreshToken(oldToken) {
    const user = this.getUserFromToken(oldToken);
    if (!user) return null;
    return this.createToken(user);
  }

  // Validate session
  validateSession(token) {
    if (!token) {
      return { valid: false, message: 'No session token provided' };
    }
    
    if (this.isTokenExpired(token)) {
      return { valid: false, message: 'Session expired. Please login again.' };
    }
    
    const user = this.getUserFromToken(token);
    if (!user) {
      return { valid: false, message: 'Invalid session token' };
    }
    
    return { valid: true, user, message: 'Session valid' };
  }
}

module.exports = new SessionService();