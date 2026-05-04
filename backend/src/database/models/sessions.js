const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: DataTypes.TEXT,
    expiresAt: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sessions',
    timestamps: true
  });
  
  return Session;
};