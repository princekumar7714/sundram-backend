import Product from "../models/product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sirf completed orders ka revenue
    const completedOrders = await Order.find({
      orderStatus: "Completed",
    });

    const totalRevenue = completedOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const completedOrdersCount =
      await Order.countDocuments({
        orderStatus: "Completed",
      });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders: completedOrdersCount,
      shippedOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};