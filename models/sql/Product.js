import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Product = sequelize.define(
  'Product',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const val = this.getDataValue('price');
        return val === null ? null : parseFloat(val);
      },
    },
    image: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    images: { type: DataTypes.JSON, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rating: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      get() {
        const val = this.getDataValue('rating');
        return val === null ? null : parseFloat(val);
      },
    },
    numReviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured: { type: DataTypes.BOOLEAN, allowNull: true },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        const val = this.getDataValue('discount');
        return val === null ? null : parseFloat(val);
      },
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

export default Product;