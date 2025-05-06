const mongoose = require('mongoose');
require('dotenv').config();

async function analyzeServices() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the services collection
    const servicesCollection = mongoose.connection.db.collection('services');
    
    // Get count of services
    const totalCount = await servicesCollection.countDocuments();
    console.log(`Total services: ${totalCount}`);

    // Analyze price distribution
    console.log('\n=== Price Distribution ===');
    
    // Define price ranges to analyze
    const priceRanges = [
      { range: 'Free ($0)', min: 0, max: 0 },
      { range: 'Very Low ($1-$20)', min: 1, max: 20 },
      { range: 'Low ($21-$100)', min: 21, max: 100 },
      { range: 'Medium ($101-$500)', min: 101, max: 500 },
      { range: 'High ($501-$2000)', min: 501, max: 2000 },
      { range: 'Premium ($2001-$5000)', min: 2001, max: 5000 },
      { range: 'Enterprise ($5001-$9000)', min: 5001, max: 9000 }
    ];
    
    for (const { range, min, max } of priceRanges) {
      const count = await servicesCollection.countDocuments({ 
        price: { $gte: min, $lte: max } 
      });
      const percentage = ((count / totalCount) * 100).toFixed(1);
      console.log(`${range}: ${count} services (${percentage}%)`);
    }

    // Analyze category distribution
    console.log('\n=== Category Distribution ===');
    const categories = [
      'Development & IT',
      'Design & Creative',
      'Digital Marketing',
      'Writing & Translation',
      'Music & Audio'
    ];
    
    for (const category of categories) {
      const count = await servicesCollection.countDocuments({ category });
      const percentage = ((count / totalCount) * 100).toFixed(1);
      console.log(`${category}: ${count} services (${percentage}%)`);
      
      // Get subcategory distribution for this category
      const subcategories = await servicesCollection.distinct('subcategory', { category });
      console.log(`  - ${subcategories.length} subcategories`);
      
      // Get count by subcategory
      for (const subcategory of subcategories) {
        const subCount = await servicesCollection.countDocuments({ 
          category, 
          subcategory 
        });
        console.log(`  - ${subcategory}: ${subCount} services`);
      }
      console.log('');
    }

    // Sample services from different price tiers
    console.log('\n=== Sample Services ===');
    
    // Get one service from each price range
    for (const { range, min, max } of priceRanges) {
      const service = await servicesCollection.findOne(
        { price: { $gte: min, $lte: max } },
        { projection: { title: 1, category: 1, subcategory: 1, price: 1, authorName: 1 } }
      );
      
      if (service) {
        console.log(`\n${range}:`);
        console.log(`- Title: ${service.title}`);
        console.log(`- Category: ${service.category} > ${service.subcategory}`);
        console.log(`- Price: $${service.price}`);
        console.log(`- Author: ${service.authorName}`);
      }
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error analyzing services:', error);
    process.exit(1);
  }
}

// Run the script
analyzeServices(); 