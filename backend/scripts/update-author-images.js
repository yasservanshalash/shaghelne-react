const mongoose = require('mongoose');
require('dotenv').config();

async function updateAuthorImages() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Define the schema to access the authorImage field
    const ServiceSchema = new mongoose.Schema({
      authorImage: String
    });

    // Create the model
    const Service = mongoose.model('Service', ServiceSchema);

    // Smaller author image placeholder (30x30 pixels)
    const AUTHOR_PLACEHOLDER = 'https://placehold.co/30x30/E6E6E6/555555?text=A';

    // Update all services with smaller author images
    const result = await Service.updateMany(
      {}, // Match all documents
      { 
        $set: { 
          authorImage: AUTHOR_PLACEHOLDER 
        } 
      }
    );

    console.log(`Updated author images for ${result.modifiedCount} services to 30x30 pixels`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating author images:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the script
updateAuthorImages(); 