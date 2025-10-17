const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateQuery } = require('../middleware/validation');

// Public routes (with optional authentication)
router.get('/', optionalAuth, validateQuery, productController.getAllProducts);
router.get('/stats', optionalAuth, productController.getProductStats);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes (require authentication)
router.post('/', authenticate, validateProduct, productController.createProduct);
router.put('/:id', authenticate, validateProduct, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;