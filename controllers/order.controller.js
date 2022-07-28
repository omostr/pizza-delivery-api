const Order = require('../models/order.model');
const Product = require('../models/product.model');

exports.addOrder = async (req, res, next) => {
  const body = req.body;

  // check product id exists
  for (let x in body.products) {
    const product = await Product.findById(body.products[x].productId).exec();
    if (!product) {
      next(new Error('product id not exist'));
      return;
    }
  }

  const order = new Order(body);

  order.save(async (err, newOrder) => {
    if (err) {
      next(err);
      return;
    }

    const newOrderPopulated = await newOrder.populate('products.productId');
    const products = newOrderPopulated.products;

    const total =
      products.length > 0
        ? products.reduce(
            (prev, curr) => prev + curr.productId.price * curr.quantity,
            0
          )
        : 0;
    const pendingsOrder = await Order.find().byStatus('PENDING').exec();

    const response = {
      orderId: newOrder._id,
      pendingOrders: pendingsOrder.length - 1,
      total,
    };

    res.json(response);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({}, (err, orders) => {
    if (err) next(err);
    res.json(orders);
  })
    .populate({
      path: 'products.productId',
    })
    .sort('createdAt');
};

exports.getNextOrder = (req, res, next) => {
  Order.find()
    .byStatus('PENDING')
    .sort('createdAt')
    .limit(1)
    .populate({
      path: 'products.productId',
    })
    .exec((err, order) => {
      if (err) next(err);
      res.json(order);
    });
};

exports.updateStatusOrder = (req, res, next) => {
  Order.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      status: req.body.status,
    }
  ).exec((err, order) => {
    if (err) next(err);
    if (!order) {
      next(new Error('Order ID not found'));
    } else {
      order.status = 'COMPLETED';
      res.json(order);
    }
  });
};
