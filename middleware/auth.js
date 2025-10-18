// API key authentication using environment variables
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Get valid API keys from environment variable
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide an API key in x-api-key header'
    });
  }
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Optional authentication for certain routes
const optionalAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (apiKey && validApiKeys.includes(apiKey)) {
    req.user = { role: 'authenticated' };
  } else {
    req.user = { role: 'guest' };
  }
  
  next();
};

module.exports = { authenticate, optionalAuth };