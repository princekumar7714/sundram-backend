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
  (req, res) => {

    console.log("==============");
    console.log("BODY =>", req.body);
    console.log("FILES =>", req.files);
    console.log("==============");

    res.json({
      success: true,
      body: req.body,
      files: req.files
    });
  }
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