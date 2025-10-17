// In-memory database (replace with actual database in production)
let products = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'Latest smartphone',
    price: 699.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 3,
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 199.99,
    category: 'Furniture',
    inStock: false,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

let nextId = 4;

class Product {
  static findAll() {
    return products;
  }

  static findById(id) {
    return products.find(product => product.id === parseInt(id));
  }

  static create(productData) {
    const newProduct = {
      id: nextId++,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  }

  static update(id, productData) {
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date()
    };

    return products[index];
  }

  static delete(id) {
    const index = products.findIndex(product => product.id === parseInt(id));
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  }

  static search(query) {
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  static findByCategory(category) {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  static getInStock() {
    return products.filter(product => product.inStock);
  }
}

module.exports = Product;