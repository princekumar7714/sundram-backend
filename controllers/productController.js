import Product from "../models/sql/Product.js";
import { Op, fn, col, where as sequelizeWhere, literal } from "sequelize";



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

// Search/Filter Products
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

    const sequelize = Product.sequelize;
    const pageNum = Math.max(1, Number(page));
    const pageLimit = Math.min(100, Math.max(1, Number(limit)));
    const offset = (pageNum - 1) * pageLimit;

    const min = Number(minPrice);
    const max = Number(maxPrice);

    const replacements = {
      search: `%${String(search || "").trim()}%`,
      category: String(category || "all").trim().toLowerCase(),
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 100000000,
      limit: pageLimit,
      offset,
    };

    const categoryAliases = {
      seeds: ["seeds", "seed"],
      fertilizers: ["fertilizers", "fertilizer"],
      pesticides: ["pesticides", "pesticide"],
      tools: ["tools", "tool"],
    };

    const normalizedCategory = String(category || "all").trim().toLowerCase();
    const candidates = categoryAliases[normalizedCategory] || (normalizedCategory === "all" ? [] : [normalizedCategory]);

    const whereParts = [];

    // category
    if (normalizedCategory && normalizedCategory !== "all" && candidates.length) {
      whereParts.push("LOWER(category) IN (:catCandidates)");
      replacements.catCandidates = candidates.map((c) => String(c).toLowerCase());
    }

    // price
    whereParts.push("price >= :min");
    whereParts.push("price <= :max");

    // search
    if (String(search || "").trim()) {
      whereParts.push("(name LIKE :search OR description LIKE :search)");
    }

    const whereSql = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

    const orderSql = (() => {
      if (sort === "price_asc") return "price ASC";
      if (sort === "price_desc") return "price DESC";
      return "createdAt DESC";
    })();

    const countRows = await sequelize.query(
      `SELECT COUNT(*) as cnt FROM products ${whereSql};`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    const total = countRows?.[0]?.cnt || 0;

    const rows = await sequelize.query(
      `SELECT * FROM products ${whereSql} ORDER BY ${orderSql} LIMIT :limit OFFSET :offset;`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    return res.json({
      items: rows,
      total: Number(total),
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

