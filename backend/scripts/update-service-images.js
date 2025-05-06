const mongoose = require('mongoose');
require('dotenv').config();

// Import the Service model
const Service = require('../dist/models/Service').default;

const PLACEHOLDER_IMAGE = 'https://placehold.co/329x245/BCBCBC/FFFFFF';

async function updateServiceImages() {
  try {
    console.log('Starting image update process...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freeio';
    console.log('Connecting to MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if we can find any services
    const serviceCount = await Service.countDocuments();
    console.log(`Found ${serviceCount} services in the database`);

    if (serviceCount === 0) {
      console.log('No services found to update');
      await mongoose.connection.close();
      return;
    }

    // Update all services
    console.log('Updating services...');
    const result = await Service.updateMany(
      {}, // Match all documents
      {
        $set: {
          images: [PLACEHOLDER_IMAGE]
        }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} services with placeholder images`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating service images:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    process.exit(1);
  }
}

// Run the script
updateServiceImages(); 