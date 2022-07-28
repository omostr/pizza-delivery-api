const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizza Delivery API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.routes.js'], // files containing annotations as above
};

require('dotenv').config();

const Product = require('./models/product.model');
const swaggerSpec = swaggerJsDoc(options);

const app = express();

const orderRoutes = require('./routes/order.routes');
const productRoutes = require('./routes/product.routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send({ error: err.message });
});
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongocluster.0krws.mongodb.net/${process.env.MONGODB_DATABASE}`
  )
  .then((result) => {
    Product.findOne().then((product) => {
      if (!product) {
        const products = [
          {
            name: 'Margherita',
            price: 5,
          },
          {
            name: 'Ortolona',
            price: 6,
          },
          {
            name: 'Diavola',
            price: 6.5,
          },
          {
            name: 'Bufalina',
            price: 7,
          },
        ];
        Product.create(products);
      }
    });
    app.listen(process.env.PORT);
    console.log(`Pizza Delivery API started on port ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
