const { CreateProduct, GetAllProducts, GetAllProductsById, UpdateProduct, DeleteProduct } = require('../Controller/ProductController');
const { authenticateToken, adminOnly } = require('../MiddleWare/AuthMiddleWare');
const express = require('express');
const router = express.Router();
const upload = require('../MiddleWare/UploadMiddleWare');

router.post('/create', authenticateToken, adminOnly, upload.single('image'), CreateProduct);
router.get('/all', GetAllProducts);
router.get('/:id', GetAllProductsById);
router.put('/:id', authenticateToken, adminOnly, UpdateProduct);
router.delete('/:id', authenticateToken, adminOnly, DeleteProduct);

module.exports = router;
