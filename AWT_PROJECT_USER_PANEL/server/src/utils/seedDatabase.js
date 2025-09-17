require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const MasterCategory = require('../models/MasterCategory');
const Category = require('../models/Category');
const Template = require('../models/Template');
const Frame = require('../models/Frame');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tempify');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await MasterCategory.deleteMany({});
    await Category.deleteMany({});
    await Template.deleteMany({});
    await Frame.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      companyName: 'Tempify Admin',
      email: 'admin@tempify.com',
      passwordHash: 'admin123', // Will be hashed by pre-save middleware
      mobile: '+1234567890',
      address: 'Admin Address, City, Country',
      role: 'admin',
      socialLinks: {
        website: 'https://tempify.com',
        facebook: 'https://facebook.com/tempify',
        instagram: 'https://instagram.com/tempify',
        twitter: 'https://twitter.com/tempify'
      }
    });
    await admin.save();
    console.log('Created admin user');

    // Create test user
    const testUser = new User({
      companyName: 'Test Company',
      email: 'test@example.com',
      passwordHash: 'test123', // Will be hashed by pre-save middleware
      mobile: '+9876543210',
      address: 'Test Address, City, Country',
      role: 'user',
      socialLinks: {
        website: 'https://testcompany.com'
      }
    });
    await testUser.save();
    console.log('Created test user');

    // Create master categories
    const masterCategories = [
      { name: 'Festival', description: 'Festival and celebration templates' },
      { name: 'Business', description: 'Business and corporate templates' },
      { name: 'Social Media', description: 'Social media post templates' },
      { name: 'Marketing', description: 'Marketing and promotional templates' }
    ];

    const createdMasterCategories = [];
    for (const masterCat of masterCategories) {
      const newMasterCat = new MasterCategory(masterCat);
      await newMasterCat.save();
      createdMasterCategories.push(newMasterCat);
    }
    console.log('Created master categories');

    // Create categories
    const categories = [
      { name: 'Diwali', masterId: createdMasterCategories[0]._id },
      { name: 'Christmas', masterId: createdMasterCategories[0]._id },
      { name: 'New Year', masterId: createdMasterCategories[0]._id },
      { name: 'Business Cards', masterId: createdMasterCategories[1]._id },
      { name: 'Letterheads', masterId: createdMasterCategories[1]._id },
      { name: 'Instagram Posts', masterId: createdMasterCategories[2]._id },
      { name: 'Facebook Covers', masterId: createdMasterCategories[2]._id },
      { name: 'Promotions', masterId: createdMasterCategories[3]._id },
      { name: 'Sales', masterId: createdMasterCategories[3]._id }
    ];

    const createdCategories = [];
    for (const category of categories) {
      const newCategory = new Category(category);
      await newCategory.save();
      createdCategories.push(newCategory);
    }
    console.log('Created categories');

    // Create sample templates
    const templates = [
      {
        name: 'Diwali Greeting Card',
        categoryId: createdCategories[0]._id,
        description: 'Beautiful Diwali greeting card template',
        imagePath: 'sample-diwali.jpg',
        tags: ['diwali', 'festival', 'greeting'],
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Christmas Wishes',
        categoryId: createdCategories[1]._id,
        description: 'Elegant Christmas wishes template',
        imagePath: 'sample-christmas.jpg',
        tags: ['christmas', 'holiday', 'wishes'],
        isFeatured: true,
        createdBy: admin._id
      },
      {
        name: 'Professional Business Card',
        categoryId: createdCategories[3]._id,
        description: 'Clean and professional business card design',
        imagePath: 'sample-business-card.jpg',
        tags: ['business', 'professional', 'corporate'],
        isPremium: true,
        createdBy: admin._id
      },
      {
        name: 'Instagram Post Template',
        categoryId: createdCategories[5]._id,
        description: 'Modern Instagram post template for businesses',
        imagePath: 'sample-instagram.jpg',
        tags: ['instagram', 'social', 'modern'],
        createdBy: admin._id
      }
    ];

    for (const template of templates) {
      const newTemplate = new Template(template);
      await newTemplate.save();
    }
    console.log('Created sample templates');

    // Create sample frames
    const frames = [
      {
        name: 'Business Frame 1',
        imagePath: 'sample-frame-1.png',
        createdBy: admin._id
      },
      {
        name: 'Social Media Frame',
        imagePath: 'sample-frame-2.png',
        createdBy: admin._id
      }
    ];

    for (const frame of frames) {
      const newFrame = new Frame(frame);
      await newFrame.save();
    }
    console.log('Created sample frames');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n👤 Admin Login:');
    console.log('Email: admin@tempify.com');
    console.log('Password: admin123');
    console.log('\n👤 Test User Login:');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeder
if (require.main === module) {
  seedData();
}

module.exports = seedData;

// =====================================================
