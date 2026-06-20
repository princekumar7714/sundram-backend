import Product from "../models/sql/Product.js";

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Product
const addProduct = async (req, res) => {
  try {
    // upload middleware should put files in req.files
    // req.files is optional depending on frontend usage.
    const images = (req.files || []).map((f) => f.path);

    const {
      name,
      price,
      category,
      description,
      stock,
      rating,
      featured,
      discount,
    } = req.body;

    const image = images[0] || req.body.image || "";

    const product = await Product.create({
      name,
      price,
      image,
      images: images.length ? images : null,
      category,
      description,
      stock,
      rating,
      featured,
      discount,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const images = (req.files || []).map((f) => f.path);

    const {
      name,
      price,
      category,
      description,
      stock,
      rating,
      featured,
      discount,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (rating !== undefined) product.rating = rating;
    if (featured !== undefined) product.featured = featured;
    if (discount !== undefined) product.discount = discount;

    if (images.length) {
      product.images = images;
      product.image = images[0];
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

