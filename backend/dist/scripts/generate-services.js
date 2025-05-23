"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Service_1 = __importStar(require("../models/Service"));
const User_1 = __importStar(require("../models/User"));
// Load environment variables
dotenv_1.default.config();
// Constants for service generation
const SERVICES_TO_GENERATE = 50;
// Arrays of available options
const CATEGORIES = [
    'Development & IT',
    'Design & Creative',
    'Digital Marketing',
    'Writing & Translation',
    'Music & Audio',
    'Video & Animation',
    'Engineering & Architecture',
    'Finance & Accounting'
];
const SUBCATEGORIES = {
    'Development & IT': [
        'Web Development',
        'Mobile App Development',
        'Game Development',
        'Software Development',
        'Desktop Applications',
        'Blockchain & Cryptocurrency',
        'AI & Machine Learning',
        'DevOps & Cloud',
        'QA & Testing'
    ],
    'Design & Creative': [
        'Web & App Design',
        'Website Design',
        'App Design',
        'UX Design',
        'Marketing Design',
        'Art & Illustration',
        'Illustration',
        'Visual Design',
        'Logo Design'
    ],
    'Digital Marketing': [
        'Search Engine Optimization (SEO)',
        'Social Media Marketing',
        'Content Marketing',
        'Email Marketing',
        'PPC Advertising',
        'SEM',
        'Influencer Marketing'
    ],
    'Writing & Translation': [
        'Content Writing',
        'Copywriting',
        'Technical Writing',
        'Translation',
        'Proofreading & Editing',
        'Creative Writing'
    ],
    'Music & Audio': [
        'Voice Over',
        'Music Production',
        'Singers & Vocalists',
        'Mixing & Mastering',
        'Session Musicians',
        'Podcast Production'
    ],
    'Video & Animation': [
        'Video Editing',
        'Animation',
        'Motion Graphics',
        'Video Production',
        '3D Animation',
        '2D Animation'
    ],
    'Engineering & Architecture': [
        'CAD & 3D Modeling',
        'Architecture Design',
        'Interior Design',
        'Civil Engineering',
        'Electrical Engineering',
        'Mechanical Engineering'
    ],
    'Finance & Accounting': [
        'Accounting',
        'Bookkeeping',
        'Tax Preparation',
        'Financial Analysis',
        'Financial Planning',
        'Financial Modeling'
    ]
};
const FEATURES_BY_CATEGORY = {
    'Development & IT': [
        'Responsive Design',
        'API Integration',
        'User Authentication',
        'Database Design',
        'Cross-Browser Compatibility',
        'Security Auditing',
        'Performance Optimization',
        'Custom Functionality',
        'Code Documentation',
        'SEO Integration',
        'WordPress Integration',
        'E-commerce Functionality',
        'Payment Gateway Integration',
        'Social Media Integration',
        'Admin Dashboard',
        'Multilingual Support',
        'Progressive Web App (PWA)',
        'Testing & QA',
        'Technical Support',
        'Fast Delivery'
    ],
    'Design & Creative': [
        'Source Files Included',
        'Multiple Revisions',
        'High Resolution',
        'Custom Design',
        'UI Elements',
        'Mobile Responsive',
        'Print Ready',
        'Vector Files',
        'Commercial Use Rights',
        'Brand Guide',
        'Social Media Kit',
        'Logo Variations',
        'Mockup Presentation',
        'Icon Design',
        'Banner Design',
        'Brand Identity Package',
        'Style Guide',
        'Typography Selection',
        'Color Palette'
    ],
    'Digital Marketing': [
        'Keyword Research',
        'Competitor Analysis',
        'On-Page SEO',
        'Off-Page SEO',
        'Technical SEO',
        'Content Strategy',
        'Link Building',
        'SEO Audit',
        'Google Analytics Setup',
        'Conversion Tracking',
        'PPC Campaign Management',
        'Social Media Marketing',
        'Email Marketing Campaign',
        'Marketing Analytics',
        'Monthly Reports',
        'Traffic Analysis',
        'ROI Tracking',
        'A/B Testing',
        'Landing Page Optimization'
    ],
    'Writing & Translation': [
        'SEO Optimized',
        'Original Content',
        'Plagiarism-Free',
        'Research Included',
        'Topic Suggestion',
        'Unlimited Revisions',
        'Quick Delivery',
        'Grammar Checking',
        'Native Speaker',
        'APA/MLA Formatting',
        'Citations Included',
        'Editing Services',
        'Technical Writing',
        'Creative Writing',
        'Content Strategy',
        'Keyword Integration',
        'Meta Descriptions',
        'Blog Posts',
        'Website Copy'
    ]
};
const SORT_TYPES = Object.values(Service_1.SortType);
const SERVICE_LEVELS = Object.values(Service_1.ServiceLevel);
const LANGUAGES = ['english', 'spanish', 'french', 'german', 'italian', 'turkish', 'arabic', 'chinese', 'japanese'];
const LOCATIONS = ['united-states', 'united-kingdom', 'canada', 'australia', 'germany', 'france', 'spain', 'italy', 'japan', 'china', 'brazil', 'india', 'mexico', 'turkey'];
const TOOLS = ['figma', 'sketch', 'adobe-photoshop', 'adobe-xd', 'adobe-illustrator', 'balsamiq', 'invision', 'wordpress', 'webflow', 'vscode', 'github', 'docker', 'jira', 'trello'];
// Service titles by category
const SERVICE_TITLES = {
    'Development & IT': [
        'I will create a responsive website using HTML, CSS and JavaScript',
        'I will develop a custom WordPress website',
        'I will build a MERN stack web application',
        'I will create a mobile app using React Native',
        'I will develop an e-commerce website with WooCommerce',
        'I will create a RESTful API with Node.js',
        'I will fix bugs in your JavaScript code',
        'I will set up your WordPress website with SEO optimization',
        'I will create a custom Laravel application',
        'I will develop a Python web application with Django'
    ],
    'Design & Creative': [
        'I will design a modern website in Figma or Adobe XD',
        'I will create a professional logo for your business',
        'I will design social media graphics for your brand',
        'I will create modern flat design illustrations',
        'I will design a mobile app UI/UX',
        'I will create wireframes and prototypes for your project',
        'I will design a stunning landing page',
        'I will create a brand identity package',
        'I will design an eye-catching book cover',
        'I will create pixel perfect UI components'
    ],
    'Digital Marketing': [
        'I will do SEO optimization for your website',
        'I will create and manage Google Ads campaigns',
        'I will manage your social media marketing',
        'I will create a content marketing strategy',
        'I will do keyword research and competitor analysis',
        'I will set up and optimize your Google Analytics',
        'I will create an email marketing campaign',
        'I will perform a complete SEO audit of your website',
        'I will optimize your Amazon product listings',
        'I will create a Facebook ads campaign'
    ],
    'Writing & Translation': [
        'I will write SEO-optimized blog posts',
        'I will create engaging website content',
        'I will write a professional resume and cover letter',
        'I will translate your content to Spanish',
        'I will proofread and edit your English content',
        'I will write technical documentation',
        'I will create product descriptions for your e-commerce store',
        'I will write a compelling sales copy',
        'I will create engaging social media content',
        'I will write an ebook or guide on any topic'
    ]
};
// Helper functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFeatures(category, count) {
    const availableFeatures = FEATURES_BY_CATEGORY[category] || FEATURES_BY_CATEGORY['Development & IT'];
    const shuffled = [...availableFeatures].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
function getRandomSubcategory(category) {
    return getRandomElement(SUBCATEGORIES[category] || []);
}
function getRandomTitle(category) {
    return getRandomElement(SERVICE_TITLES[category] || SERVICE_TITLES['Development & IT']);
}
// Generate service description
function generateDescription(title, category) {
    const prefixes = [
        'Professional and high-quality ',
        'Expert-level ',
        'Fast and reliable ',
        'Customized ',
        'Premium quality '
    ];
    const suffixes = [
        ' tailored to your specific needs.',
        ' with exceptional attention to detail.',
        ' delivered on time and within budget.',
        ' with unlimited revisions until you\'re 100% satisfied.',
        ' by an experienced professional.',
        ' that will exceed your expectations.'
    ];
    const categoryTerms = {
        'Development & IT': ['development', 'programming', 'coding', 'implementation', 'solution'],
        'Design & Creative': ['design', 'creative work', 'artwork', 'visual content', 'creative solution'],
        'Digital Marketing': ['marketing strategy', 'campaign', 'optimization', 'digital marketing solution', 'promotional strategy'],
        'Writing & Translation': ['content', 'writing', 'text', 'copy', 'documentation']
    };
    const term = getRandomElement(categoryTerms[category] || categoryTerms['Development & IT']);
    return `${getRandomElement(prefixes)}${term}${getRandomElement(suffixes)} ${title.toLowerCase().replace('i will ', '')}.`;
}
// Main function to generate services
function generateServices() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/freeio');
            console.log('Connected to MongoDB');
            // Find freelancer users
            const freelancers = yield User_1.default.find({ role: User_1.Role.FREELANCER }).select('_id');
            if (freelancers.length === 0) {
                console.error('No freelancer users found. Please run the main seed script first.');
                process.exit(1);
            }
            // Generate services
            const services = [];
            for (let i = 0; i < SERVICES_TO_GENERATE; i++) {
                const category = getRandomElement(CATEGORIES);
                const subcategory = getRandomSubcategory(category);
                const title = getRandomTitle(category);
                const featureCount = getRandomInt(3, 6);
                const service = {
                    title,
                    description: generateDescription(title, category),
                    price: getRandomInt(50, 1000) * 10, // Random price between $50 and $1000
                    category,
                    subcategory,
                    status: Service_1.ServiceStatus.ACTIVE,
                    deliveryTime: getRandomInt(1, 14), // 1-14 days
                    revisions: getRandomInt(1, 5),
                    features: getRandomFeatures(category, featureCount),
                    requirements: `Please provide all necessary information for your ${subcategory.toLowerCase()} project, including your preferences and any specific requirements.`,
                    images: [`https://via.placeholder.com/600x400?text=${encodeURIComponent(subcategory.slice(0, 10))}`],
                    userId: getRandomElement(freelancers)._id,
                    rating: (3 + Math.random() * 2).toFixed(1), // Random rating between 3.0 and 5.0
                    review: getRandomInt(5, 150),
                    level: getRandomElement(SERVICE_LEVELS),
                    location: getRandomElement(LOCATIONS),
                    sort: getRandomElement(SORT_TYPES),
                    tools: Array.from({ length: getRandomInt(1, 3) }, () => getRandomElement(TOOLS)),
                    language: getRandomElement(LANGUAGES),
                    tags: subcategory.split(' ').filter(word => word.length > 2)
                };
                services.push(service);
            }
            // Clear existing services if needed
            // Uncomment the next line if you want to clear existing services
            // await Service.deleteMany({});
            // Insert generated services
            const createdServices = yield Service_1.default.insertMany(services);
            console.log(`Successfully generated ${createdServices.length} services!`);
            // Disconnect from MongoDB
            yield mongoose_1.default.disconnect();
            console.log('Disconnected from MongoDB');
        }
        catch (error) {
            console.error('Error generating services:', error);
            process.exit(1);
        }
    });
}
// Run the script
generateServices();
