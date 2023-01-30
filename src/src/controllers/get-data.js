const response = require("../utils/response"),
  { Product } = require("../../src/databases"),
  httpStatus = require("http-status");

module.exports = async (req, res) => {
  const { category, size, color, minPrice, maxPrice } = req.query;

  try {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (size) {
      query.size = size;
    }
    if (color) {
      query.color = color;
    }
    if (minPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { $lte: maxPrice };
    }

    const products = await Product.find(query);
    if (!products) {
      return response(res, httpStatus.NOT_FOUND, "No product found", products);
    }

    if (products.length === 0) {
      return response(res, httpStatus.NOT_FOUND, "No product found");
    }

    return response(
      res,
      httpStatus.OK,
      "Product retrieved successfully",
      products
    );
  } catch (error) {
    return response(res, httpStatus.NOT_FOUND, "there is an error", error);
  }
};
