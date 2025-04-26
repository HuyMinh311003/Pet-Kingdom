require('dotenv').config({ path: './src/config/.env' });
const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Promotion = require('./src/models/Promotion');
const Order = require('./src/models/Order');
const Cart = require('./src/models/Cart');

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Promotion.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123', // For testing; in real seed, hash if needed
        phone: '0123456789',
        role: 'Customer'
      },
      {
        name: 'Jane Admin',
        email: 'jane@example.com',
        password: 'password123',
        phone: '0987654321',
        role: 'Admin'
      }
    ]);

    // Create sample categories
    const categories = await Category.insertMany([
      {
        name: 'Dogs',
        description: 'All about dogs',
        type: 'pet',
        order: 1
      },
      {
        name: 'Cats',
        description: 'All about cats',
        type: 'pet',
        order: 2
      },
      {
        name: 'Pet Tools',
        description: 'Tools and accessories for pets',
        type: 'tool',
        order: 1
      }
    ]);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Premium Dog Food',
        description: 'Healthy food for dogs',
        price: 50,
        categoryId: categories[0]._id,
        stock: 100,
        imageUrl: '/uploads/dogfood.jpg',
        type: 'pet',
        birthday: new Date('2022-01-01'),
        gender: 'male',
        vaccinated: true,
        tags: ['dog', 'food', 'premium']
      },
      {
        name: 'Pet Grooming Scissors',
        description: 'High quality scissors for pet grooming',
        price: 20,
        categoryId: categories[2]._id,
        stock: 50,
        imageUrl: '/uploads/scissors.jpg',
        type: 'tool',
        brand: 'PetCare',
        tags: ['tool', 'grooming']
      }
    ]);

    // Create sample promotion
    const promotions = await Promotion.insertMany([
      {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
        minOrderValue: 30,
        maxDiscount: 20,
        usageLimit: 100,
        usageCount: 0,
        productType: 'all',
        isActive: true,
        description: 'Save 10% on all orders'
      }
    ]);

    // Create sample order referencing John Doe and one product
    const orders = await Order.insertMany([
      {
        user: users[0]._id,
        items: [{
          product: products[0]._id,
          quantity: 2,
          price: products[0].price
        }],
        subtotal: products[0].price * 2,
        shippingFee: 5,
        discount: 5,
        total: products[0].price * 2 + 5 - 5,
        shippingAddress: {
          street: '123 Main St',
          ward: 'Ward 1',
          district: 'District 1',
          city: 'City'
        },
        phone: '0123456789',
        paymentMethod: 'COD'
      }
    ]);

    // Create sample cart for John Doe with one tool product
    const carts = await Cart.insertMany([
      {
        user: users[0]._id,
        items: [{
          product: products[1]._id,
          quantity: 1
        }]
      }
    ]);

    console.log('Seed Data Added:');
    console.log({ users, categories, products, promotions, orders, carts });
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
