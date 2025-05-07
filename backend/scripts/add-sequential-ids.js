require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the service schema to match our models
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
    sequentialId: {
      type: Number,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

// Create the Service model
const Service = mongoose.model('Service', ServiceSchema);

// Log the MongoDB URL (with password hidden)
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
const displayUrl = mongoUrl.replace(/:([^\/]+)@/, ':***@');
console.log(`Connecting to MongoDB at: ${displayUrl}`);

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all services
      const services = await Service.find({});
      console.log(`Found ${services.length} services`);
      
      // Update each service with a sequential ID
      let counter = 1;
      for (const service of services) {
        service.sequentialId = counter++;
        await service.save();
        console.log(`Updated service ${service._id} with sequentialId ${service.sequentialId}`);
      }
      
      console.log('All services updated with sequential IDs');
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