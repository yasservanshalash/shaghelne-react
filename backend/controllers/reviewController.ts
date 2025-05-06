import { Request, Response } from 'express';
import ReviewService from '../services/reviewService';

class ReviewController {
  static async getAll(req: Request, res: Response) {
    try {
      const { serviceId, userId, minRating } = req.query;
      
      const filters: any = {};
      
      if (serviceId) filters.serviceId = serviceId as string;
      if (userId) filters.userId = userId as string;
      if (minRating) filters.minRating = parseInt(minRating as string, 10);
      
      const reviews = await ReviewService.getAll(filters);
      return res.status(200).json(reviews);
    } catch (error: any) {
      console.error('Get reviews error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const review = await ReviewService.getById(id);
      return res.status(200).json(review);
    } catch (error: any) {
      console.error('Get review error:', error);
      
      if (error.message === 'Review not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { serviceId, rating, comment } = req.body;
      
      // Validate required fields
      if (!serviceId || !rating) {
        return res.status(400).json({ 
          message: 'Required fields: serviceId, rating' 
        });
      }
      
      // Validate rating
      const ratingNum = parseInt(rating, 10);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      
      const reviewData = {
        serviceId,
        rating: ratingNum,
        comment
      };
      
      const review = await ReviewService.create(userId, reviewData);
      return res.status(201).json(review);
    } catch (error: any) {
      console.error('Create review error:', error);
      
      if (error.message === 'You have already reviewed this service') {
        return res.status(400).json({ message: error.message });
      }
      
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const { rating, comment } = req.body;
      
      // Verify ownership
      const review = await ReviewService.getById(id);
      if (review.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only update your own reviews' 
        });
      }
      
      const updateData: any = {};
      
      if (rating !== undefined) {
        // Validate rating
        const ratingNum = parseInt(rating, 10);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        updateData.rating = ratingNum;
      }
      
      if (comment !== undefined) {
        updateData.comment = comment;
      }
      
      const updatedReview = await ReviewService.update(id, updateData);
      return res.status(200).json(updatedReview);
    } catch (error: any) {
      console.error('Update review error:', error);
      
      if (error.message === 'Review not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Verify ownership
      const review = await ReviewService.getById(id);
      if (review.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only delete your own reviews' 
        });
      }
      
      await ReviewService.delete(id);
      return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error: any) {
      console.error('Delete review error:', error);
      
      if (error.message === 'Review not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByService(req: Request, res: Response) {
    try {
      const { serviceId } = req.params;
      const reviews = await ReviewService.getByService(serviceId);
      return res.status(200).json(reviews);
    } catch (error: any) {
      console.error('Get service reviews error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reviews = await ReviewService.getByUser(userId);
      return res.status(200).json(reviews);
    } catch (error: any) {
      console.error('Get user reviews error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ReviewController; 