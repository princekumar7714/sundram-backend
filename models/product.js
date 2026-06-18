import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,

    image: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    category: String,
    description: String,
    stock: Number,
    rating: Number,

    numReviews: {
      type: Number,
      default: 0,
    },

    featured: Boolean,
    discount: Number,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;