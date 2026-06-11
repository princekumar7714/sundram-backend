import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/User.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalRevenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueData.length > 0
        ? totalRevenueData[0].totalRevenue
        : 0;

    const totalOrders =
      await Order.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};