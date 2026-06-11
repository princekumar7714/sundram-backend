import Product from "../models/product.js";
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
  try {

    console.log(req.body);

    const {
      name,
      price,
      image,
      category,
      description,
      stock,
      rating,
      featured,
      discount
    } = req.body;

    if (
      !name ||
      !price ||
      !image ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      description,
      stock,
      rating,
      featured,
      discount
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getProducts, getProductById, addProduct, updateProduct, deleteProduct };