require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schemas for the migration
const PackagePlanSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  deliveryTime: Number,
  revisions: Number,
  features: [String],
  includedPages: Number
});

const ServiceSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: String,
    subcategory: String,
    status: String,
    deliveryTime: Number,
    revisions: Number,
    features: [String],
    requirements: String,
    images: [String],
    attachments: [String],
    userId: Schema.Types.ObjectId,
    sequentialId: Number,
    rating: Number,
    reviewCount: Number,
    authorName: String,
    authorImage: String,
    location: String,
    tools: [String],
    deviceTypes: [String],
    appTypes: [String],
    language: [String],
    packagePlans: {
      basic: PackagePlanSchema,
      standard: PackagePlanSchema,
      premium: PackagePlanSchema
    }
  },
  { timestamps: true }
);

// Create a list of sample tools, device types, and app types for random assignment
const sampleTools = [
  'Adobe XD', 'Figma', 'Adobe Photoshop', 'Sketch', 'Illustrator',
  'InDesign', 'After Effects', 'Premiere Pro', 'Blender', 'Unity'
];

const sampleDeviceTypes = ['Mobile', 'Desktop', 'Tablet', 'Smart TV', 'Wearable'];

const sampleAppTypes = [
  'Business', 'Graphics & design', 'Food & drink', 'Education',
  'Healthcare', 'E-commerce', 'Social Media', 'Entertainment', 'Travel'
];

const sampleLocations = [
  'New York', 'London', 'Berlin', 'Tokyo', 'Paris',
  'Sydney', 'Remote', 'San Francisco', 'Toronto', 'Singapore'
];

const sampleLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

// Get 1-3 random items from an array
const getRandomItems = (array, max = 3) => {
  const numItems = Math.floor(Math.random() * max) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
};

// Random float between min and max with 1 decimal place
const randomFloat = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Random integer between min and max
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random package plan based on the service price
const generatePackagePlan = (title, priceMultiplier, service, deliveryDelta, revisionsDelta) => {
  const basePrice = service.price || 29;
  const price = Math.round(basePrice * priceMultiplier);
  const deliveryTime = (service.deliveryTime || 3) + deliveryDelta;
  const revisions = (service.revisions || 1) + revisionsDelta;
  
  // Generate features based on service features or defaults
  let features = service.features || [];
  if (features.length === 0) {
    features = [
      'Source file',
      'Commercial use',
      'Custom design',
      'Responsive design',
      'Multiple revisions'
    ];
  }
  
  // Use subset of features for basic, more for standard, all for premium
  const featureCount = title === 'Basic' ? 2 : (title === 'Standard' ? 3 : features.length);
  const selectedFeatures = features.slice(0, Math.min(featureCount, features.length));
  
  return {
    title,
    price,
    description: `${title} package for ${service.title || 'this service'}`,
    deliveryTime,
    revisions,
    features: selectedFeatures,
    includedPages: title === 'Basic' ? 2 : (title === 'Standard' ? 4 : 6)
  };
};

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
mongoose.connect(mongoUrl)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create the Service model
      const Service = mongoose.model('Service', ServiceSchema);
      
      // Get all services
      const services = await Service.find({});
      console.log(`Found ${services.length} services to update`);
      
      // Update each service with new fields
      for (const service of services) {
        // Generate random rating between 4.0 and 5.0
        const rating = randomFloat(4.0, 5.0);
        // Generate random review count between 0 and 100
        const reviewCount = randomInt(0, 100);
        
        // Get user info if available
        let authorName = "Unknown Author";
        let authorImage = "/images/team/fl-1.png";
        
        if (service.userId) {
          try {
            const User = mongoose.model('User', new Schema({
              name: String,
              profileImage: String
            }));
            
            const user = await User.findById(service.userId);
            if (user) {
              authorName = user.name || authorName;
              authorImage = user.profileImage || authorImage;
            }
          } catch (error) {
            console.log('User model not found or error fetching user', error.message);
          }
        }
        
        // Create package plans
        const packagePlans = {
          basic: generatePackagePlan('Basic', 1.0, service, 0, 0),
          standard: generatePackagePlan('Standard', 1.5, service, 1, 2),
          premium: generatePackagePlan('Premium', 2.5, service, 2, 4)
        };
        
        // Update service with new fields
        service.rating = rating;
        service.reviewCount = reviewCount;
        service.authorName = authorName;
        service.authorImage = authorImage;
        service.location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        service.tools = getRandomItems(sampleTools);
        service.deviceTypes = getRandomItems(sampleDeviceTypes, 2);
        service.appTypes = getRandomItems(sampleAppTypes, 2);
        service.language = getRandomItems(sampleLanguages, 2);
        service.packagePlans = packagePlans;
        
        // Save the updated service
        await service.save();
        console.log(`Updated service: ${service.sequentialId} - ${service.title}`);
      }
      
      console.log('All services updated successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error updating services:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 