import Wishlist from "../models/sql/Wishlist.js";
import Product from "../models/sql/Product.js";

// GET wishlist products for logged-in user
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistRows = await Wishlist.findAll({
      where: { userId },
      attributes: ['productId'],
      raw: true,
    });

    const productIds = wishlistRows.map((r) => r.productId);
    if (productIds.length === 0) return res.json({ items: [] });

    const products = await Product.findAll({
      where: { id: productIds },
      order: [["createdAt", "DESC"]],
    });

    res.json({ items: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST toggle wishlist
// If exists -> remove, else -> add
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    // Ensure product exists
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = await Wishlist.findOne({ where: { userId, productId } });

    if (existing) {
      await existing.destroy();
      return res.json({ action: "removed" });
    }

    await Wishlist.create({ userId, productId });
    return res.json({ action: "added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE explicit remove
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await Wishlist.destroy({ where: { userId, productId } });
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getWishlist, toggleWishlist, removeFromWishlist };

