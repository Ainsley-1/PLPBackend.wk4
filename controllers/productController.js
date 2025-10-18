const Product = require('../models/product');

const productController = {
  // Get all products with filtering, pagination, and search
  getAllProducts: (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        inStock,
        minPrice,
        maxPrice,
        search,
        sortBy = 'id',
        sortOrder = 'asc'
      } = req.query;

      let filteredProducts = Product.findAll();

      // Apply filters
      if (category) {
        filteredProducts = Product.findByCategory(category);
      }

      if (inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.inStock === (inStock === 'true')
        );
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= parseFloat(minPrice)
        );
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          product => product.price <= parseFloat(maxPrice)
        );
      }

      if (search) {
        filteredProducts = Product.search(search);
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      // Prepare pagination metadata
      const totalPages = Math.ceil(filteredProducts.length / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      res.json({
        success: true,
        data: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: filteredProducts.length,
          itemsPerPage: parseInt(limit),
          hasNext,
          hasPrev
        },
        filters: {
          category,
          inStock,
          minPrice,
          maxPrice,
          search,
          sortBy,
          sortOrder
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single product by ID
  getProductById: (req, res, next) => {
    try {
      const product = Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${req.params.id} does not exist`
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new product
  createProduct: (req, res, next) => {
    try {
      const newProduct = Product.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  // Update product
  updateProduct: (req, res, next) => {
    try {
      const updatedProduct = Product.update(req.params.id, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${req.params.id} does not exist`
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete product
  deleteProduct: (req, res, next) => {
    try {
      const deleted = Product.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${req.params.id} does not exist`
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get product statistics
  getProductStats: (req, res, next) => {
    try {
      const products = Product.findAll();
      
      const totalProducts = products.length;
      const inStockCount = products.filter(p => p.inStock).length;
      const outOfStockCount = totalProducts - inStockCount;
      const categories = [...new Set(products.map(p => p.category))];
      const totalValue = products.reduce((sum, product) => sum + product.price, 0);
      const averagePrice = totalValue / totalProducts;

      res.json({
        success: true,
        data: {
          totalProducts,
          inStockCount,
          outOfStockCount,
          categories,
          totalValue: parseFloat(totalValue.toFixed(2)),
          averagePrice: parseFloat(averagePrice.toFixed(2))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;