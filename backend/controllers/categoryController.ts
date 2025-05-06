import { Request, Response } from 'express';
import CategoryService from '../services/categoryService';

// Extended Request interface to include user
interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

interface CategoryBody {
  name: string;
  description: string;
  subcategories?: string[];
  icon?: string;
}

class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll();
      
      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: category
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      // Only admin can create categories
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can create categories'
        });
      }
      
      const data: CategoryBody = req.body;
      
      // Validation
      if (!data.name || !data.description) {
        return res.status(400).json({
          success: false,
          message: 'Name and description are required'
        });
      }
      
      const category = await CategoryService.create(data);
      
      return res.status(201).json({
        success: true,
        data: category
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      // Only admin can update categories
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can update categories'
        });
      }
      
      const { id } = req.params;
      const data: Partial<CategoryBody> = req.body;
      
      const category = await CategoryService.getById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      const updatedCategory = await CategoryService.update(id, data);
      
      return res.status(200).json({
        success: true,
        data: updatedCategory
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      // Only admin can delete categories
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can delete categories'
        });
      }
      
      const { id } = req.params;
      
      const category = await CategoryService.getById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      await CategoryService.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getSubcategories(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const category = await CategoryService.getById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: category.subcategories
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const categories = await CategoryService.search(query);
      
      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default CategoryController; 