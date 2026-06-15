import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

 images: [
  {
    type: String,
  },
],

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  featured: {
    type: Boolean,
    default: false,
  },

  discount: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
});

export default mongoose.model("Product", productSchema);