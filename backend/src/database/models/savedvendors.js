const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SavedVendor = sequelize.define("SavedVendor", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'saved_vendors',
    timestamps: false
  });
  
  return SavedVendor;
};