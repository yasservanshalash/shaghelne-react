const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

// First, we need to define the schemas before we can use the models
// Service Schema
const ServiceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'DELETED'],
      default: 'ACTIVE',
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    revisions: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    requirements: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    authorName: {
      type: String,
    },
    authorImage: {
      type: String,
    },
    serviceId: {
      type: Number,
    }
  },
  { timestamps: true }
);

// User Schema (simplified for our needs)
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'FREELANCER', 'EMPLOYER', 'USER'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

// Register models
const Service = mongoose.model('Service', ServiceSchema);
const User = mongoose.model('User', UserSchema);

async function seedServices() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get all freelancers
    const freelancers = await User.find({ role: { $in: ['FREELANCER', 'freelancer'] } });
    
    if (freelancers.length === 0) {
      console.log('No freelancers found. Please run the main seed script first.');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found ${freelancers.length} freelancers`);
    
    // Print freelancer info to debug
    freelancers.forEach((freelancer, i) => {
      console.log(`Freelancer ${i+1}: ${freelancer.firstName} ${freelancer.lastName} (${freelancer._id})`);
    });

    // Author names
    const authorNames = [
      'John Smith',
      'Jane Doe',
      'David Johnson',
      'Sarah Williams',
      'Michael Brown',
      'Emily Davis',
      'Robert Wilson',
      'Lisa Taylor',
      'Daniel Thompson',
      'Olivia Martinez',
      'Anthony Garcia',
      'Sophia Lee',
      'William Anderson',
      'Emma Thomas',
      'James Jackson',
      'Ava White',
      'Christopher Harris',
      'Mia Clark',
      'Matthew Lewis',
      'Abigail Walker'
    ];

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Expanded categories and subcategories
    const categories = {
      'Development & IT': [
        'Web Development', 'Mobile App Development', 'Game Development',
        'Software Development', 'WordPress', 'E-commerce Development',
        'Blockchain Development', 'AI & Machine Learning', 'DevOps & Cloud',
        'QA & Testing', 'Desktop Applications', 'Cybersecurity'
      ],
      'Design & Creative': [
        'Logo Design', 'Web Design', 'Graphic Design', 'UI/UX Design',
        'Illustration', 'Animation', 'Brand Identity', 'Packaging Design',
        '3D Modeling', 'Product Design', 'Print Design', 'Social Media Design',
        'App Design', 'Banner Design', 'Icon Design'
      ],
      'Digital Marketing': [
        'SEO', 'Social Media Marketing', 'Content Marketing',
        'Email Marketing', 'PPC Advertising', 'Influencer Marketing',
        'Market Research', 'Analytics & Data', 'SEM', 'Video Marketing',
        'Lead Generation', 'Affiliate Marketing', 'Mobile Marketing'
      ],
      'Writing & Translation': [
        'Content Writing', 'Copywriting', 'Translation',
        'Technical Writing', 'Proofreading', 'Creative Writing',
        'Resume Writing', 'Scriptwriting', 'Ghostwriting', 'Grant Writing',
        'Legal Writing', 'White Papers', 'Research & Summaries'
      ],
      'Music & Audio': [
        'Voice Over', 'Music Production', 'Audio Editing',
        'Podcast Production', 'Sound Design', 'Jingles',
        'Mixing & Mastering', 'Songwriting', 'Audiobook Production',
        'Sound Effects', 'Vocal Tuning', 'Beat Making'
      ]
    };

    // Expanded price points - from $0 to $9000
    const priceTiers = [
      // Free/Very Low Tier
      [0, 5, 10, 15, 20],
      // Low Tier
      [25, 30, 40, 50, 60, 75, 80, 90, 100],
      // Medium Tier
      [125, 150, 175, 200, 250, 300, 350, 400, 450, 500],
      // High Tier
      [600, 750, 800, 900, 1000, 1200, 1500, 1800, 2000],
      // Premium Tier
      [2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000]
    ];

    // Service images from placeholder
    const PLACEHOLDER_IMAGE = 'https://placehold.co/329x245/BCBCBC/FFFFFF';
    const PLACEHOLDER_IMAGES = Array(5).fill().map((_, i) => `https://placehold.co/329x245/BCBCBC/FFFFFF?text=Service${i+1}`);
    const AUTHOR_PLACEHOLDER = 'https://placehold.co/30x30/E6E6E6/555555?text=A';
    const AUTHOR_IMAGES = [
      'https://placehold.co/30x30/E6E6E6/555555?text=J',
      'https://placehold.co/30x30/E6E6E6/555555?text=M',
      'https://placehold.co/30x30/E6E6E6/555555?text=D',
      'https://placehold.co/30x30/E6E6E6/555555?text=S',
      'https://placehold.co/30x30/E6E6E6/555555?text=L',
      'https://placehold.co/30x30/E6E6E6/555555?text=R'
    ];

    // Generate services
    const services = [];
    let serviceId = 1;

    // Helper function to get random item from array
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    
    // Helper function to get random rating
    const getRandomRating = () => (Math.floor(Math.random() * 10) + 36) / 10; // Between 3.6 and 4.5
    
    // Helper function to get random number within range
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate more services per subcategory
    const servicesPerSubcategory = {
      free: 2,    // Services with $0-20 price
      low: 4,     // Services with $25-100 price
      medium: 3,  // Services with $125-500 price
      high: 2,    // Services with $600-2000 price
      premium: 1  // Services with $2500-9000 price
    };

    // Generate services for each category
    for (const [category, subcategories] of Object.entries(categories)) {
      // Generate multiple services per subcategory
      for (const subcategory of subcategories) {
        
        // Generate services for each price tier
        for (let tierIndex = 0; tierIndex < priceTiers.length; tierIndex++) {
          const tierPrices = priceTiers[tierIndex];
          const servicesToGenerate = tierIndex === 0 ? servicesPerSubcategory.free :
                                    tierIndex === 1 ? servicesPerSubcategory.low :
                                    tierIndex === 2 ? servicesPerSubcategory.medium :
                                    tierIndex === 3 ? servicesPerSubcategory.high :
                                    servicesPerSubcategory.premium;
          
          for (let i = 0; i < servicesToGenerate; i++) {
            const freelancer = getRandomItem(freelancers);
            const price = getRandomItem(tierPrices);
            const rating = getRandomRating();
            const reviewCount = getRandomNumber(0, 200);
            
            // Use freelancer name or a random author name
            const authorName = (freelancer.firstName && freelancer.lastName) 
              ? `${freelancer.firstName} ${freelancer.lastName}`
              : getRandomItem(authorNames);
            
            // Add descriptors based on price tier
            let titlePrefix = '';
            let descriptionQuality = '';
            
            if (tierIndex === 0) {
              titlePrefix = 'I will create a basic';
              descriptionQuality = 'Basic';
            } else if (tierIndex === 1) {
              titlePrefix = 'I will design a professional';
              descriptionQuality = 'Professional';
            } else if (tierIndex === 2) {
              titlePrefix = 'I will develop a premium';
              descriptionQuality = 'Premium quality';
            } else if (tierIndex === 3) {
              titlePrefix = 'I will create an advanced and comprehensive';
              descriptionQuality = 'Advanced and comprehensive';
            } else {
              titlePrefix = 'I will deliver an enterprise-grade';
              descriptionQuality = 'Enterprise-grade';
            }
            
            const service = {
              title: `${titlePrefix} ${subcategory.toLowerCase()} solution for your business`,
              description: `${descriptionQuality} ${subcategory} service with fast delivery and exceptional results. Perfect for ${category.toLowerCase()} needs. Satisfaction guaranteed.`,
              price: price,
              category: category,
              subcategory: subcategory,
              status: 'ACTIVE',
              deliveryTime: tierIndex === 4 ? getRandomNumber(14, 60) : getRandomNumber(1, 14), // Higher tier = longer delivery
              revisions: tierIndex === 0 ? 1 : tierIndex === 4 ? getRandomNumber(5, 10) : getRandomNumber(2, 5),
              features: [
                'Professional Quality',
                'Fast Delivery',
                'Source Files',
                'Unlimited Revisions',
                '24/7 Support',
                'Custom Design',
                'Responsive Layout', 
                'Cross-platform Compatibility',
                'SEO Optimization',
                'Social Media Integration'
              ].slice(0, tierIndex === 0 ? 2 : tierIndex === 4 ? 10 : getRandomNumber(3, 7)), // Higher tier = more features
              requirements: 'Please provide your project details and any specific requirements.',
              images: tierIndex === 4 ? PLACEHOLDER_IMAGES : [PLACEHOLDER_IMAGE],
              attachments: [],
              userId: freelancer._id,
              rating: rating,
              reviewCount: reviewCount,
              authorName: authorName,
              authorImage: getRandomItem(AUTHOR_IMAGES),
              serviceId: serviceId++
            };
            
            services.push(service);
          }
        }
      }
    }

    // Insert all services
    const result = await Service.insertMany(services);
    console.log(`Created ${result.length} services across multiple categories and price points (from $0 to $9000)`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding services:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    process.exit(1);
  }
}

// Run the script
seedServices(); 