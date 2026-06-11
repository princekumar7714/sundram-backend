import express from "express";

const router = express.Router();

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Get All Products
router.get("/getallproducts", getProducts);

// Get Single Product
router.get("/getsingleproduct/:id", getProductById);

// Add Product
router.post("/addproduct", addProduct);

// Update Product
router.put("/updateproduct/:id", updateProduct);

// Delete Product
router.delete("/deleteproduct/:id", deleteProduct);


export default router;