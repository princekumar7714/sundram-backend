import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Order = sequelize.define(
  'Order',
  {
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },

    orderItems: { type: DataTypes.JSON, allowNull: true },

    shipping_fullName: { type: DataTypes.STRING, allowNull: true },
    shipping_phone: { type: DataTypes.STRING, allowNull: true },
    shipping_address: { type: DataTypes.TEXT, allowNull: true },
    shipping_city: { type: DataTypes.STRING, allowNull: true },
    shipping_state: { type: DataTypes.STRING, allowNull: true },
    shipping_pincode: { type: DataTypes.STRING, allowNull: true },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'COD',
    },

    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

    isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    paidAt: { type: DataTypes.DATE, allowNull: true },

    isDelivered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },

    orderStatus: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
  },
  {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

export default Order;

