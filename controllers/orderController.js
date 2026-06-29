import Order from "../models/Order.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      // frontend sends: paymentMethod, totalPrice, orderStatus
      paymentMethod,
      totalPrice,
      orderStatus,
      // allow direct fields too (in case other clients use different payload)
      shipping_fullName,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      userId,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
    } = req.body || {};

    // Map frontend payload to Sequelize Order model fields
    const mappedPayload = {
      userId: userId ?? req?.user?.id ?? null,
      orderItems: orderItems ?? req.body?.order_items ?? null,

      shipping_fullName:

        shipping_fullName ?? shippingAddress?.fullName ?? shippingAddress?.name ?? null,
      shipping_phone:
        shipping_phone ?? shippingAddress?.phone ?? shippingAddress?.mobile ?? null,
      shipping_address:
        shipping_address ?? shippingAddress?.address ?? shippingAddress?.street ?? null,
      shipping_city:
        shipping_city ?? shippingAddress?.city ?? null,
      shipping_state:
        shipping_state ?? shippingAddress?.state ?? null,
      shipping_pincode:
        shipping_pincode ?? shippingAddress?.pincode ?? shippingAddress?.zipCode ?? null,

      paymentMethod: paymentMethod ?? 'COD',
      totalPrice: totalPrice ?? 0,
      orderStatus: orderStatus ?? 'Pending',

      // optional
      isPaid: isPaid ?? false,
      paidAt: paidAt ?? null,
      isDelivered: isDelivered ?? false,
      deliveredAt: deliveredAt ?? null,
    };

    const order = new Order(mappedPayload);
    const savedOrder = await order.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Completed") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};