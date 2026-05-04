const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vendor = sequelize.define("Vendor", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    availability: {
      type: DataTypes.ENUM('available', 'unavailable'),
      defaultValue: 'available'
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: DataTypes.DECIMAL(10, 2),
    rating: DataTypes.DECIMAL(3, 2),
    imageUrl: DataTypes.STRING,
    location: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'vendors',
    timestamps: true
  });
  
  return Vendor;
};