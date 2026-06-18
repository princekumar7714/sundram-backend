import express from "express";
import upload from "../middleware/upload.js";
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


router.post(
  "/addproduct",
  upload.array("images", 5),
  addProduct
);

// Update Product
router.put(
  "/updateproduct/:id",
  upload.array("images", 5),
  updateProduct
);

// Delete Product
router.delete("/deleteproduct/:id", deleteProduct);


export default router;