const Joi = require('joi');

// Product validation schema
const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string().min(2).max(50).required(),
  inStock: Joi.boolean().default(true)
});

// Query parameters validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().min(2).max(50),
  inStock: Joi.boolean(),
  minPrice: Joi.number().positive().precision(2),
  maxPrice: Joi.number().positive().precision(2),
  search: Joi.string().min(1).max(100),
  sortBy: Joi.string().valid('name', 'price', 'createdAt', 'updatedAt').default('id'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

const validateQuery = (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

module.exports = { validateProduct, validateQuery };