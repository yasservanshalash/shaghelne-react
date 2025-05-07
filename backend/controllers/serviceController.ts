import { Request, Response } from 'express';
import ServiceService from '../services/serviceService';

class ServiceController {
  static async getAll(req: Request, res: Response) {
    try {
      const { category, minPrice, maxPrice, status, deliveryTime, page, limit } = req.query;
      
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (status) filters.status = status as string;
      if (deliveryTime) filters.deliveryTime = parseInt(deliveryTime as string, 10);
      if (page) filters.page = parseInt(page as string, 10);
      if (limit) filters.limit = parseInt(limit as string, 10);
      
      const result = await ServiceService.getAll(filters);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get services error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = await ServiceService.getById(id);
      return res.status(200).json(service);
    } catch (error: any) {
      console.error('Get service error:', error);
      
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Invalid ID format') {
        return res.status(400).json({ 
          message: 'Invalid service ID format. Please use a numeric ID (1, 2, 3) or a valid MongoDB ObjectID.'
        });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const serviceData = req.body;
      
      // Validate required fields
      if (!serviceData.title || !serviceData.description || !serviceData.price || 
          !serviceData.category || !serviceData.deliveryTime || !serviceData.revisions) {
        return res.status(400).json({ 
          message: 'Required fields: title, description, price, category, deliveryTime, revisions' 
        });
      }
      
      const service = await ServiceService.create(userId, serviceData);
      return res.status(201).json(service);
    } catch (error: any) {
      console.error('Create service error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const serviceData = req.body;
      
      // Find service first to verify ownership
      const service = await ServiceService.getById(id);
      
      // Verify ownership
      if (service.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only update your own services' });
      }
      
      const updatedService = await ServiceService.update(id, serviceData);
      return res.status(200).json(updatedService);
    } catch (error: any) {
      console.error('Update service error:', error);
      
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find service first to verify ownership
      const service = await ServiceService.getById(id);
      
      // Verify ownership
      if (service.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only delete your own services' });
      }
      
      await ServiceService.delete(id);
      return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error: any) {
      console.error('Delete service error:', error);
      
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const services = await ServiceService.getByUser(userId);
      return res.status(200).json(services);
    } catch (error: any) {
      console.error('Get services by user error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async uploadImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // In a real implementation, you would:
      // 1. Handle file upload (with multer middleware)
      // 2. Store the file (e.g. on S3, local filesystem)
      // 3. Get the image URL
      
      const imageUrl = req.body.imageUrl; // Simplification - in real app, get from file upload
      
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }
      
      // Find service first to verify ownership
      const service = await ServiceService.getById(id);
      
      // Verify ownership
      if (service.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only upload images to your own services' });
      }
      
      const updatedService = await ServiceService.uploadImage(id, imageUrl);
      return res.status(200).json(updatedService);
    } catch (error: any) {
      console.error('Upload service image error:', error);
      
      if (error.message === 'Service not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async search(req: Request, res: Response) {
    try {
      const { query, category, minPrice, maxPrice, page, limit } = req.query;
      
      const criteria: any = {};
      
      if (query) criteria.query = query as string;
      if (category) criteria.category = category as string;
      if (minPrice) criteria.minPrice = parseFloat(minPrice as string);
      if (maxPrice) criteria.maxPrice = parseFloat(maxPrice as string);
      if (page) criteria.page = parseInt(page as string, 10);
      if (limit) criteria.limit = parseInt(limit as string, 10);
      
      const result = await ServiceService.search(criteria);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Search services error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ServiceController; 