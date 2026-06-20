import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Product = sequelize.define(
  'Product',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    images: { type: DataTypes.JSON, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    numReviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured: { type: DataTypes.BOOLEAN, allowNull: true },
    discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  },
  {
    tableName: 'products',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

export default Product;

