require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schemas
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['ADMIN', 'FREELANCER', 'EMPLOYER', 'USER'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: Number, required: true },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'],
      default: 'FULL_TIME',
    },
    location: { type: Object },
    category: { type: String, required: true },
    subcategory: { type: String, required: false },
    requirements: { type: [String], default: [] },
    company: { type: Object, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'DRAFT'],
      default: 'OPEN',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN',
    },
    category: { type: String, required: true },
    subcategory: { type: String, required: false },
    skills: { type: [String], default: [] },
    attachments: { type: [String], default: [] },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Register models
const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Project = mongoose.model('Project', ProjectSchema);

// Job data
const jobsData = [
  {
    title: "Senior React Developer Needed",
    description: "We are looking for an experienced React developer to join our team for a long-term project. The ideal candidate should have 4+ years of experience with React, Redux, and modern JavaScript.",
    salary: 85000,
    jobType: "FULL_TIME",
    location: {
      city: "Amsterdam",
      subCity: "Centrum",
      specificArea: "Jordaan"
    },
    category: "Development & IT",
    subcategory: "Web Development",
    requirements: [
      "4+ years experience with React.js",
      "Experience with Redux, Context API",
      "Knowledge of modern JavaScript (ES6+)",
      "Experience with responsive design",
      "Strong problem-solving skills"
    ],
    company: {
      name: "CodeMasters Inc",
      size: "50-100",
      industry: "Software Development"
    },
    status: "OPEN"
  },
  {
    title: "UX/UI Designer for Fintech Project",
    description: "We're seeking a talented UX/UI designer for our fintech application. You'll be responsible for creating intuitive user interfaces and improving user experience for our financial products.",
    salary: 70000,
    jobType: "CONTRACT",
    location: {
      city: "Amsterdam",
      subCity: "Zuid",
      specificArea: "Zuidas"
    },
    category: "Design & Creative",
    subcategory: "UI/UX Design",
    requirements: [
      "Portfolio demonstrating UX/UI design skills",
      "Experience with Figma or Sketch",
      "Understanding of user-centered design principles",
      "Experience in financial or fintech sector a plus",
      "Strong communication skills"
    ],
    company: {
      name: "FinanceApp Solutions",
      size: "20-50",
      industry: "Financial Technology"
    },
    status: "OPEN"
  },
  {
    title: "Backend Developer - Node.js",
    description: "We are looking for a Node.js backend developer to help us build scalable APIs and services for our growing platform. You will work closely with our frontend team to deliver seamless user experiences.",
    salary: 75000,
    jobType: "FULL_TIME",
    location: {
      city: "Amsterdam",
      subCity: "Oost",
      specificArea: "Science Park"
    },
    category: "Development & IT",
    subcategory: "Software Development",
    requirements: [
      "Strong experience with Node.js and Express",
      "Knowledge of MongoDB and/or PostgreSQL",
      "Experience with RESTful APIs",
      "Understanding of microservices architecture",
      "Good testing practices"
    ],
    company: {
      name: "Tech Innovators",
      size: "10-20",
      industry: "Tech Startup"
    },
    status: "OPEN"
  },
  {
    title: "Digital Marketing Specialist",
    description: "Looking for a digital marketing expert to help grow our online presence through various channels. You'll be responsible for creating and executing marketing campaigns across multiple platforms.",
    salary: 60000,
    jobType: "PART_TIME",
    location: {
      city: "Amsterdam",
      subCity: "West",
      specificArea: "Oud-West"
    },
    category: "Digital Marketing",
    subcategory: "Social Media Marketing",
    requirements: [
      "Experience with social media marketing",
      "Knowledge of SEO/SEM",
      "Experience with email marketing campaigns",
      "Analytical skills for tracking campaign performance",
      "Creative content creation abilities"
    ],
    company: {
      name: "Growth Hackers",
      size: "5-10",
      industry: "Marketing"
    },
    status: "OPEN"
  },
  {
    title: "Mobile App Developer - iOS",
    description: "We're looking for an iOS developer to join our mobile team. You'll be working on our flagship consumer app used by thousands of customers daily.",
    salary: 80000,
    jobType: "FULL_TIME",
    location: {
      city: "Amsterdam",
      subCity: "Noord",
      specificArea: "NDSM Wharf"
    },
    category: "Development & IT",
    subcategory: "Mobile App Development",
    requirements: [
      "3+ years iOS development experience",
      "Proficiency in Swift and Objective-C",
      "Experience with Core Data and networking",
      "Understanding of Apple's design principles",
      "Knowledge of App Store submission process"
    ],
    company: {
      name: "AppForge",
      size: "20-50",
      industry: "Mobile Applications"
    },
    status: "OPEN"
  }
];

// Project data
const projectsData = [
  {
    title: "E-commerce Website Redesign",
    description: "We need to completely redesign our e-commerce website to improve user experience and conversion rates. Looking for a skilled web designer and developer who can implement a modern, responsive design.",
    budget: 8000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "OPEN",
    category: "Design & Creative",
    subcategory: "Web Design",
    skills: ["Web Design", "UI/UX", "Shopify", "HTML/CSS", "JavaScript"],
    attachments: []
  },
  {
    title: "Mobile App Development for Fitness Tracking",
    description: "Looking to create a fitness tracking mobile app for iOS and Android. The app should track workouts, set goals, and provide analytics on user progress.",
    budget: 15000,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    status: "OPEN",
    category: "Development & IT",
    subcategory: "Mobile App Development",
    skills: ["React Native", "iOS", "Android", "API Integration", "UX Design"],
    attachments: []
  },
  {
    title: "Content Writing for Blog Articles",
    description: "Need a content writer to create 10 SEO-optimized blog articles for our tech company's website. Topics will include cloud computing, AI, and digital transformation.",
    budget: 2000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "OPEN",
    category: "Writing & Translation",
    subcategory: "Content Writing",
    skills: ["SEO Writing", "Tech Writing", "Blog Writing", "Research"],
    attachments: []
  },
  {
    title: "Brand Identity Design",
    description: "Our startup needs a complete brand identity design including logo, color scheme, typography, and basic style guide. We're in the sustainable energy sector targeting environmentally conscious consumers.",
    budget: 5000,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    status: "OPEN",
    category: "Design & Creative",
    subcategory: "Brand Identity",
    skills: ["Logo Design", "Branding", "Typography", "Color Theory"],
    attachments: []
  },
  {
    title: "Social Media Marketing Campaign",
    description: "Looking for a social media expert to create and run a 3-month marketing campaign across Instagram, Facebook, and LinkedIn for our new product launch.",
    budget: 6000,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    status: "OPEN",
    category: "Digital Marketing",
    subcategory: "Social Media Marketing",
    skills: ["Social Media Strategy", "Content Creation", "Paid Advertising", "Analytics"],
    attachments: []
  }
];

async function seedUserContent() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the user
    const targetEmail = 'yashalas@student.codam.nl';
    const user = await User.findOne({ email: targetEmail });

    if (!user) {
      console.log(`User with email ${targetEmail} not found. Creating user...`);
      
      // Create the user if they don't exist
      const newUser = new User({
        firstName: 'Yashalas',
        lastName: 'Student',
        email: targetEmail,
        role: 'EMPLOYER',
      });
      
      await newUser.save();
      console.log(`Created new user with ID: ${newUser._id}`);
      
      // Use the new user object
      var userId = newUser._id;
    } else {
      console.log(`Found user: ${user.firstName} ${user.lastName} (${user._id})`);
      var userId = user._id;
    }

    // Delete existing jobs and projects for this user
    await Job.deleteMany({ userId });
    await Project.deleteMany({ userId });
    console.log(`Deleted existing jobs and projects for user ${userId}`);

    // Create jobs for the user
    const jobPromises = jobsData.map(jobData => {
      const job = new Job({
        ...jobData,
        userId
      });
      return job.save();
    });
    
    const jobs = await Promise.all(jobPromises);
    console.log(`Created ${jobs.length} jobs for user ${userId}`);

    // Create projects for the user
    const projectPromises = projectsData.map(projectData => {
      const project = new Project({
        ...projectData,
        userId
      });
      return project.save();
    });
    
    const projects = await Promise.all(projectPromises);
    console.log(`Created ${projects.length} projects for user ${userId}`);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedUserContent(); 