import { create } from "zustand";
import axios from 'axios';

const getRandomFallbackImage = () => {
  const fallbackImages = [
    "/images/listings/g-1.jpg",
    "/images/listings/g-17.jpg"
  ];
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

const transformServiceData = (service) => {
  const fallbackImage = getRandomFallbackImage();
  
  // Prefer simpler sequential ID when available
  const id = service.sequentialId || service._id || service.id;
  
  // Build default package plans if not available
  const packagePlans = service.packagePlans || {
    basic: {
      title: "Basic",
      price: service.price || 29,
      description: "Basic package with essential features",
      deliveryTime: service.deliveryTime || 3,
      revisions: service.revisions || 1,
      features: service.features?.slice(0, 2) || ["Source file"],
      includedPages: 2
    },
    standard: {
      title: "Standard",
      price: (service.price || 29) * 1.5,
      description: "Standard package with more features",
      deliveryTime: (service.deliveryTime || 3) + 1,
      revisions: (service.revisions || 1) + 1,
      features: service.features?.slice(0, 4) || ["Source file", "More options"],
      includedPages: 4
    },
    premium: {
      title: "Premium",
      price: (service.price || 29) * 2.5,
      description: "Premium package with all features",
      deliveryTime: (service.deliveryTime || 3) + 2,
      revisions: (service.revisions || 1) + 3,
      features: service.features || ["Source file", "All options", "Priority support"],
      includedPages: 6
    }
  };
  
  // Default values for various fields
  const deviceTypes = service.deviceTypes || ["Mobile", "Desktop"];
  const appTypes = service.appTypes || ["Business", "Graphics & design"];
  const tools = service.tools || ["Adobe XD", "Figma", "Adobe Photoshop"];
  const location = service.location || "Remote";
  const language = service.language || ["English"];
  const viewCount = service.viewCount || 0;
  const inQueueCount = service.inQueueCount || 0;
  const completedCount = service.completedCount || 0;
  const level = service.level || "All levels";
  const tags = service.tags || [];
  
  // Default FAQs
  const faq = service.faq || [
    {
      question: "How long will my project take?",
      answer: `Our typical delivery time is ${service.deliveryTime || 3} days, but it can vary based on project complexity.`
    },
    {
      question: "Do you offer revisions?",
      answer: `Yes, we offer ${service.revisions || 2} revisions with our standard package.`
    },
    {
      question: "What file formats will I receive?",
      answer: "We provide industry-standard formats suitable for your project needs."
    }
  ];
  
  // Default extra services
  const extraServices = service.extraServices || [
    {
      title: "Express 24-hour delivery",
      price: Math.round((service.price || 29) * 0.5),
      deliveryTime: 1
    },
    {
      title: "Additional revisions (per round)",
      price: Math.round((service.price || 29) * 0.3),
      deliveryTime: 1
    },
    {
      title: "Source files",
      price: Math.round((service.price || 29) * 0.4),
      deliveryTime: 0
    }
  ];
  
  // Compute lastDeliveryDate if not available
  const lastDeliveryDate = service.lastDeliveryDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  
  // Calculate number of days since last delivery
  const daysSinceLastDelivery = Math.floor((Date.now() - new Date(lastDeliveryDate).getTime()) / (24 * 60 * 60 * 1000));
  
  return {
    ...service,
    // Ensure the service has an ID property that frontend components expect
    id: id,
    author: {
      img: service.authorImage || "/images/team/fl-1.png",
      name: service.authorName || "Unknown Author"
    },
    rating: service.rating || 5.0,
    review: service.reviewCount || 0,
    category: service.category || "Uncategorized",
    gallery: service.images || [fallbackImage],
    img: service.images?.[0] || fallbackImage,
    thumbnail: service.images?.[0] || fallbackImage,
    image: service.images?.[0] || fallbackImage,
    packagePlans,
    deviceTypes,
    appTypes,
    tools,
    location,
    language,
    level,
    tags,
    faq,
    extraServices,
    viewCount,
    inQueueCount,
    completedCount,
    lastDeliveryDate,
    daysSinceLastDelivery,
    completionTime: service.completionTime || service.deliveryTime || 3
  };
};

const useServiceStore = create((set) => ({
  services: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  },
  isLoading: false,
  error: null,
  
  // Fetch all services with pagination and filtering
  fetchServices: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Attempting to fetch services from API with filters:", filters);
      // Build query parameters
      const { page = 1, limit = 12, minPrice, maxPrice, deliveryTime, ...otherFilters } = filters;
      
      // Construct query string
      let queryString = `page=${page}&limit=${limit}`;
      
      // Add price filters if provided
      if (typeof minPrice === 'number') queryString += `&minPrice=${minPrice}`;
      if (typeof maxPrice === 'number') queryString += `&maxPrice=${maxPrice}`;
      if (deliveryTime) queryString += `&deliveryTime=${deliveryTime}`;
      
      // Add any other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      console.log(`Fetching services with query: ${queryString}`);
      const response = await axios.get(`http://localhost:5000/api/services?${queryString}`);
      
      // Handle both old and new API response formats
      const responseData = response.data;
      const services = responseData.services || responseData;
      const pagination = responseData.pagination || {
        total: services.length,
        page,
        limit,
        pages: Math.ceil(services.length / limit)
      };
      
      console.log("Successfully fetched services from API:", {
        count: services.length,
        pagination,
        firstItem: services[0] ? 
          `id: ${services[0]._id}, sequentialId: ${services[0].sequentialId}, title: ${services[0].title}` : 
          'none'
      });
      
      const transformedServices = services.map(transformServiceData);
      
      set({ 
        services: transformedServices, 
        pagination,
        isLoading: false 
      });
      
      return { services: transformedServices, pagination };
    } catch (error) {
      console.error("Error fetching services from API:", error);
      
      set({ 
        services: [], 
        pagination: {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 12,
          pages: 0
        },
        isLoading: false,
        error: "Failed to fetch services from API. Please ensure the API is running at http://localhost:5000/api/services" 
      });
      
      return { services: [], pagination: { total: 0, page: 1, limit: 12, pages: 0 } };
    }
  },

  // Fetch service by ID
  fetchServiceById: async (id) => {
    console.log(`fetchServiceById - Starting to fetch service with ID ${id} (${typeof id})`);
    set({ isLoading: true, error: null });
    try {
      // Ensure id is not null/undefined before API call
      if (!id) {
        console.error("fetchServiceById - Invalid ID provided:", id);
        throw new Error("Invalid service ID");
      }
      
      console.log(`fetchServiceById - Attempting to fetch service with ID ${id} from API`);
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      console.log("fetchServiceById - API response for service:", response.data);
      
      set({ isLoading: false });
      return transformServiceData(response.data);
    } catch (error) {
      console.error(`fetchServiceById - Error fetching service ${id} from API:`, error);
      
      // Extract the specific error message if it's from our API
      let errorMessage = "Failed to fetch service. Please ensure the API is running.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400 && error.response.data?.message) {
          // This is likely an invalid ID format error (not a valid MongoDB ObjectId)
          errorMessage = error.response.data.message;
          console.log("Invalid MongoDB ObjectId format:", id);
        } else if (error.response.status === 404) {
          errorMessage = "Service not found";
        }
      }
      
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Search services
  searchServices: async (query, page = 1, limit = 12) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/api/services/search/query?q=${query}&page=${page}&limit=${limit}`);
      
      // Handle both old and new API response formats
      const responseData = response.data;
      const services = responseData.services || responseData;
      const pagination = responseData.pagination || {
        total: services.length,
        page: 1,
        limit: services.length,
        pages: 1
      };
      
      const transformedServices = services.map(transformServiceData);
      
      set({ 
        services: transformedServices, 
        pagination,
        isLoading: false 
      });
      
      return { services: transformedServices, pagination };
    } catch (error) {
      console.error("Error searching services:", error);
      set({ 
        services: [], 
        error: "Failed to search services. Please ensure the API is running.", 
        isLoading: false 
      });
      return { services: [], pagination: { total: 0, page: 1, limit: 12, pages: 0 } };
    }
  }
}));

export default useServiceStore; 