const mongoose = require("mongoose"),
  { category, color, gender, size } = require("../../common");

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(category),
      required: false,
      default: category.none,
    },
    color: {
      type: String,
      enum: Object.values(color),
      required: false,
      default: color.none,
    },
    size: {
      type: String,
      enum: Object.values(size),
      required: false,
      default: size.none,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
      required: false,
      default: gender.none,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
