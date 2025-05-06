const mongoose = require('mongoose');
require('dotenv').config();

async function checkServices() {
  try {
    // Connect to MongoDB - use the same connection string as the seed script
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio');
    console.log('Connected to MongoDB');

    // Get count of services
    const count = await mongoose.connection.db.collection('services').countDocuments();
    console.log(`Total services: ${count}`);
    
    if (count > 0) {
      // Get sample services - just 3 to keep the output manageable
      const services = await mongoose.connection.db.collection('services').find().limit(3).toArray();
      console.log('Sample services:');
      
      services.forEach((service, index) => {
        console.log(`\n--- Service ${index + 1} ---`);
        console.log(`Title: ${service.title}`);
        console.log(`Category: ${service.category} > ${service.subcategory}`);
        console.log(`Price: $${service.price}`);
        console.log(`Rating: ${service.rating} (${service.reviewCount} reviews)`);
        console.log(`Author: ${service.authorName}`);
        console.log(`Images: ${service.images}`);
      });
      
      // Count services by category
      console.log('\n--- Services by Category ---');
      for (const category of ['Development & IT', 'Design & Creative', 'Digital Marketing', 'Writing & Translation', 'Music & Audio']) {
        const categoryCount = await mongoose.connection.db.collection('services').countDocuments({ category });
        console.log(`${category}: ${categoryCount} services`);
      }
      
      // Count services by price range
      console.log('\n--- Services by Price Range ---');
      const priceRanges = [
        { range: '$5-$20', min: 5, max: 20 },
        { range: '$21-$50', min: 21, max: 50 },
        { range: '$51-$100', min: 51, max: 100 },
        { range: '$101-$250', min: 101, max: 250 },
        { range: '$251+', min: 251, max: 10000 }
      ];
      
      for (const { range, min, max } of priceRanges) {
        const priceCount = await mongoose.connection.db.collection('services').countDocuments({ 
          price: { $gte: min, $lte: max } 
        });
        console.log(`${range}: ${priceCount} services`);
      }
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
checkServices(); 