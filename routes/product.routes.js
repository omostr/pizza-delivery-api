const path = require('path');

const express = require('express');

const productController = require('../controllers/product.controller');

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Returns all menu products
 *     tags:
 *          - products
 *     description: Returns all menu products
 *     responses:
 *       200:
 *         description: A JSON array of products
 */
router.get('/', productController.getProducts);

//router.post('/cart', productController.addOrder);

module.exports = router;
