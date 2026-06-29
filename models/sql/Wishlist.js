import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

// Wishlist model: stores product ids user has wishlisted.
// Unique constraint enforced at DB level in schema.sql.
const Wishlist = sequelize.define(
  'Wishlist',
  {
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'wishlist',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  }
);

export default Wishlist;

