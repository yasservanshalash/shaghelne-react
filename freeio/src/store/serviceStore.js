import { create } from "zustand";
import axios from 'axios';
import { product1 } from "@/data/product";

const getRandomFallbackImage = () => {
  const fallbackImages = [
    "/images/listings/g-1.jpg",
    "/images/listings/g-17.jpg"
  ];
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

const transformServiceData = (service) => {
  const fallbackImage = getRandomFallbackImage();
  return {
    ...service,
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
    image: service.images?.[0] || fallbackImage
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
      
      console.log("Successfully fetched services from API:", services);
      const transformedServices = services.map(transformServiceData);
      
      set({ 
        services: transformedServices, 
        pagination,
        isLoading: false 
      });
      
      return { services: transformedServices, pagination };
    } catch (error) {
      console.error("Error fetching services from API:", error);
      console.log("Falling back to local product1 data");
      
      // Use local data as fallback
      const startIndex = (filters.page - 1) * filters.limit || 0;
      const endIndex = startIndex + (filters.limit || 12);
      const localServices = product1.slice(startIndex, endIndex);
      const localPagination = {
        total: product1.length,
        page: filters.page || 1,
        limit: filters.limit || 12,
        pages: Math.ceil(product1.length / (filters.limit || 12))
      };
      
      const transformedServices = localServices.map(transformServiceData);
      console.log("Using local fallback data:", transformedServices);
      
      set({ 
        services: transformedServices, 
        pagination: localPagination,
        isLoading: false,
        error: "API unavailable, using local data" 
      });
      
      return { services: transformedServices, pagination: localPagination };
    }
  },

  // Fetch service by ID
  fetchServiceById: async (id) => {
    console.log(`fetchServiceById - Starting to fetch service with ID ${id}`);
    set({ isLoading: true, error: null });
    try {
      console.log(`fetchServiceById - Attempting to fetch service with ID ${id} from API`);
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      console.log("fetchServiceById - API response for service:", response.data);
      set({ isLoading: false });
      return transformServiceData(response.data);
    } catch (error) {
      console.error(`fetchServiceById - Error fetching service ${id} from API:`, error);
      // Try to find the service in local data
      console.log(`fetchServiceById - Falling back to local data lookup for ID ${id}`);
      const localService = product1.find(item => Number(item.id) === Number(id));
      
      if (localService) {
        console.log(`fetchServiceById - Found service in local data: ID=${id}, Title="${localService.title}"`);
        set({ isLoading: false });
        return transformServiceData(localService);
      }
      
      console.error(`fetchServiceById - Service with ID ${id} not found in local data either`);
      set({ error: error.message, isLoading: false });
      throw new Error(`Service with ID ${id} not found`);
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
    } catch (error) {
      console.error("Error searching services:", error);
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useServiceStore; 