const path = require('path');

const express = require('express');

const orderController = require('../controllers/order.controller');

const router = express.Router();

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Returns all orders
 *     tags:
 *       - orders
 *     description: Returns all orders
 *     responses:
 *       200:
 *         description: A JSON array of orders
 */
router.get('/', orderController.getOrders);

/**
 * @openapi
 * /orders/getNext:
 *   get:
 *     summary: Returns the next order to prepare
 *     tags:
 *       - orders
 *     responses:
 *       200:
 *         description: A JSON object of the order
 */
router.get('/getNext', orderController.getNextOrder);

/**
 * @openapi
 * /orders:
 *  post:
 *      summary: Create a new order
 *      tags:
 *          - orders
 *      description: Creates a order
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              enum: [PENDING, COMPLETED]
 *                          recipient:
 *                              type: object
 *                              description: recipient order details
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                  surname:
 *                                      type: string
 *                                  address:
 *                                      type: string
 *                                  phone:
 *                                      type: string
 *                                      required: false
 *                          notes:
 *                              type: string
 *                              required: false
 *                              description: order notes
 *                          products:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      productId:
 *                                          type: string
 *                                      quantity:
 *                                          type: integer
 *                                          default: 1
 *                      required:
 *                           - recipient
 *                           - products
 *      responses:
 *          200:
 *              description: A JSON object of the new order created
 *
 */
router.post('/', orderController.addOrder);

/**
 * @openapi
 * /orders/updateStatus/{id}:
 *  patch:
 *      summary: Update the order status
 *      tags:
 *          - orders
 *      parameters:
 *          - name: id
 *            description: Order ID
 *            required: true
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              enum: [PENDING, COMPLETED]
 *                              default: COMPLETED
 *      responses:
 *          200:
 *              description: A JSON object of the updated order
 */
router.patch('/updateStatus/:id', orderController.updateStatusOrder);

module.exports = router;
