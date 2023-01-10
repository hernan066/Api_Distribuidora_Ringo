const { response } = require("express");
const { Product } = require("../models");

const getProducts = async (req, res = response) => {
  const { limit = 1000, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  const orderProducts = products.sort(function(a, b){
    if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
})

  res.json({
    total,
    products: orderProducts,
  });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

const postProduct = async (req, res = response) => {
  const { state, ...body } = req.body;

  // Generar la data a guardar
  const data = {
    ...body,
    user: req.user,
  };

  const product = new Product(data);

  // Guardar DB
  await product.save();

  res.status(200).json(product);
};

const putProduct = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.user = req.user;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const productDelete = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(productDelete);
};

module.exports = {
  postProduct,
  getProducts,
  getProduct,
  putProduct,
  deleteProduct,
};
