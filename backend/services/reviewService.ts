import Review, { ReviewDocument } from '../models/Review';
import Service from '../models/Service';
import User from '../models/User';

interface ReviewFilters {
  serviceId?: string;
  userId?: string;
  minRating?: number;
}

class ReviewService {
  static async getAll(filters: ReviewFilters = {}) {
    let query: any = {};
    
    if (filters.serviceId) {
      query.serviceId = filters.serviceId;
    }
    
    if (filters.userId) {
      query.userId = filters.userId;
    }
    
    if (filters.minRating !== undefined) {
      query.rating = { $gte: filters.minRating };
    }
    
    const reviews = await Review.find(query);
    return reviews;
  }
  
  static async getById(reviewId: string) {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return review;
  }
  
  static async create(userId: string, serviceId: string, data: Partial<ReviewDocument>) {
    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Check if user already reviewed this service
    const existingReview = await Review.findOne({
      userId,
      serviceId
    });
    
    if (existingReview) {
      throw new Error('You have already reviewed this service');
    }
    
    const review = await Review.create({
      ...data,
      userId,
      serviceId
    });
    
    // Update service provider's rating
    const serviceProvider = await User.findById(service.userId);
    if (serviceProvider) {
      const userReviews = await Review.find({ 
        serviceId: { $in: await Service.find({ userId: serviceProvider.id }).distinct('_id') }
      });
      
      const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / userReviews.length;
      
      await User.findByIdAndUpdate(serviceProvider.id, {
        rating: averageRating,
        totalReviews: userReviews.length
      });
    }
    
    return review;
  }
  
  static async update(reviewId: string, data: Partial<ReviewDocument>) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { ...data },
      { new: true }
    );
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Update service provider's rating
    const service = await Service.findById(review.serviceId);
    if (service) {
      const serviceProvider = await User.findById(service.userId);
      if (serviceProvider) {
        const userReviews = await Review.find({ 
          serviceId: { $in: await Service.find({ userId: serviceProvider.id }).distinct('_id') }
        });
        
        const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / userReviews.length;
        
        await User.findByIdAndUpdate(serviceProvider.id, {
          rating: averageRating
        });
      }
    }
    
    return review;
  }
  
  static async delete(reviewId: string) {
    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Update service provider's rating
    const service = await Service.findById(review.serviceId);
    if (service) {
      const serviceProvider = await User.findById(service.userId);
      if (serviceProvider) {
        const userReviews = await Review.find({ 
          serviceId: { $in: await Service.find({ userId: serviceProvider.id }).distinct('_id') }
        });
        
        let averageRating = 0;
        if (userReviews.length > 0) {
          const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / userReviews.length;
        }
        
        await User.findByIdAndUpdate(serviceProvider.id, {
          rating: averageRating,
          totalReviews: userReviews.length
        });
      }
    }
    
    return { message: 'Review deleted successfully' };
  }
  
  static async getByService(serviceId: string) {
    const reviews = await Review.find({ serviceId });
    return reviews;
  }
  
  static async getByUser(userId: string) {
    // Get all services by the user
    const services = await Service.find({ userId });
    const serviceIds = services.map(service => service.id);
    
    // Get reviews for those services
    const reviews = await Review.find({ serviceId: { $in: serviceIds } });
    return reviews;
  }
}

export default ReviewService; 