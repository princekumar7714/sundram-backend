import Product from "../models/sql/Product.js";
const { Op } = Product.sequelize;


const normalizeUploadPaths = (files = []) => {
  return files.map((f) => {
    // multer f.path is filesystem path; normalize to public URL path
    // frontend expects: /uploads/<filename>
    const filename = String(f?.path || "").split(/\\|\//).pop();
    return filename ? `/uploads/${filename}` : "";
  }).filter(Boolean);
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search/Filter Products (Flipkart-like)
const searchProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "all",
      minPrice = "0",
      maxPrice = "100000000",
      sort = "createdAt_desc",
      page = "1",
      limit = "30",
    } = req.query;

    const min = Number(minPrice);
    const max = Number(maxPrice);
    const pageNum = Math.max(1, Number(page));
    const pageLimit = Math.min(100, Math.max(1, Number(limit)));

    const where = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      where.price = {
        ...(Number.isFinite(min) ? { [Op.gte]: min } : {}),
        ...(Number.isFinite(max) ? { [Op.lte]: max } : {}),
      };
    }

    if (search && String(search).trim()) {
      const s = String(search).trim();
      where[Op.or] = [
        { name: { [Op.like]: `%${s}%` } },
        { description: { [Op.like]: `%${s}%` } },
      ];
    }

    let order = [["createdAt", "DESC"]];
    if (sort === "price_asc") order = [["price", "ASC"]];
    if (sort === "price_desc") order = [["price", "DESC"]];

    const offset = (pageNum - 1) * pageLimit;

    const { rows, count } = await Product.findAndCountAll({
      where,
      order,
      offset,
      limit: pageLimit,
    });

    res.json({
      items: rows,
      total: count,
      page: pageNum,
      limit: pageLimit,
    });
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
    const images = normalizeUploadPaths(req.files || []);

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

    const images = normalizeUploadPaths(req.files || []);

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

    // If admin uploaded new images in this request, replace stored images
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
  searchProducts,
};

