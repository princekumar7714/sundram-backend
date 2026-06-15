import Product from "../models/product.js";

// Get All Products
const getProducts = async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// Get Single Product
const getProductById = async (req, res) => {
try {
const product = await Product.findById(req.params.id);

if (product) {
  res.json(product);
} else {
  res.status(404).json({
    message: "Product not found",
  });
}


} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// Add Product
const addProduct = async (req, res) => {
  try {

    console.log("BODY => ", req.body);
    console.log("FILES => ", req.files);

    if (!req.body) {
      return res.status(400).json({
        message: "req.body is undefined"
      });
    }

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

    // rest code
    const images = req.files?.map(
      file => `/uploads/${file.filename}`
    ) || [];

    const newProduct = new Product({
      name,
      price,
      category,
      description,
      stock,
      rating,
      featured,
      discount,
      images,
      image: images[0]
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
// Update Product
const updateProduct = async (req, res) => {
try {
const { id } = req.params;


const product = await Product.findById(id);

if (!product) {
  return res.status(404).json({
    message: "Product not found",
  });
}

let images = product.images;

if (req.files && req.files.length > 0) {
  images = req.files.map(
    (file) =>
      `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );
}

const updatedProduct =
  await Product.findByIdAndUpdate(
    id,
    {
      ...req.body,
      images,
    },
    { new: true }
  );

res.json(updatedProduct);
  

} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

// Delete Product
const deleteProduct = async (req, res) => {
try {
const { id } = req.params;


await Product.findByIdAndDelete(id);

res.json({
  message: "Product deleted successfully",
});


} catch (error) {
res.status(500).json({
message: error.message,
});
}
};

export {
getProducts,
getProductById,
addProduct,
updateProduct,
deleteProduct,
};
