const response = require("../utils/response"),
  { Product } = require("../../src/databases"),
  { randomDigit, randomString } = require("../utils/random"),
  httpStatus = require('http-status');

module.exports = async (req, res) => {
  //raad from productData.json file and insert into database
  const productData = require("../../productData.json");

  //loop through productData array

  data = productData["dafiti"];

  for (let i = 0; i < data.length; i++) {
    //Check if product already exists using product link
    const product = await Product.findOne({
      link: data[i].link,
    });

    if (!product) {
      //if product does not exist then insert into database
      const newProduct = new Product({
        id: randomDigit(10),
        name: data[i].name,
        link: data[i].link,
        photo: data[i].photo,
        price: parseFloat(data[i].price),
        description: data[i].description,
      });

      console.log("Saving new product: "+newProduct.name);
      await newProduct.save();
    } else {
      //Update product
      product.name = data[i].name;
      product.link = data[i].link;
      product.photo = data[i].photo;
      product.price =parseFloat(data[i].price);
      product.description = data[i].description;
      console.log("Updating existing product: "+product.name);
      await product.save();
    }
  }

  return response(res, httpStatus.OK,"Data inserted successfully");
};
