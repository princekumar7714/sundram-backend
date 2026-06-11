import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/all", getOrders);

router.put("/:id/status", updateOrderStatus);

export default router;
