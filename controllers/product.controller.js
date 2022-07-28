const Product = require('../models/product.model');

exports.getProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) next(err);
    res.json(products);
  });
};
