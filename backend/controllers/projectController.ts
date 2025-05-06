import { Request, Response } from 'express';
import ProjectService from '../services/projectService';

class ProjectController {
  static async getAll(req: Request, res: Response) {
    try {
      const { category, minBudget, maxBudget, status, skills, deadline } = req.query;
      
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (minBudget) filters.minBudget = parseFloat(minBudget as string);
      if (maxBudget) filters.maxBudget = parseFloat(maxBudget as string);
      if (status) filters.status = status as string;
      if (skills) filters.skills = (skills as string).split(',');
      if (deadline) filters.deadline = new Date(deadline as string);
      
      const projects = await ProjectService.getAll(filters);
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Get projects error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getById(id);
      return res.status(200).json(project);
    } catch (error: any) {
      console.error('Get project error:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const projectData = req.body;
      
      // Validate required fields
      if (!projectData.title || !projectData.description || !projectData.budget || 
          !projectData.category || !projectData.deadline) {
        return res.status(400).json({ 
          message: 'Required fields: title, description, budget, category, deadline' 
        });
      }
      
      const project = await ProjectService.create(userId, projectData);
      return res.status(201).json(project);
    } catch (error: any) {
      console.error('Create project error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const projectData = req.body;
      
      // Find project first to verify ownership
      const project = await ProjectService.getById(id);
      
      // Verify ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only update your own projects' });
      }
      
      const updatedProject = await ProjectService.update(id, projectData);
      return res.status(200).json(updatedProject);
    } catch (error: any) {
      console.error('Update project error:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find project first to verify ownership
      const project = await ProjectService.getById(id);
      
      // Verify ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only delete your own projects' });
      }
      
      await ProjectService.delete(id);
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      console.error('Delete project error:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const projects = await ProjectService.getByUser(userId);
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Get projects by user error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async search(req: Request, res: Response) {
    try {
      const { query, category, minBudget, maxBudget } = req.query;
      
      const criteria: any = {};
      
      if (query) criteria.query = query as string;
      if (category) criteria.category = category as string;
      if (minBudget) criteria.minBudget = parseFloat(minBudget as string);
      if (maxBudget) criteria.maxBudget = parseFloat(maxBudget as string);
      
      const projects = await ProjectService.search(criteria);
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Search projects error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getProposals(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find project first to verify ownership
      const project = await ProjectService.getById(id);
      
      // Verify ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only view proposals for your own projects' 
        });
      }
      
      const proposals = await ProjectService.getProposals(id);
      return res.status(200).json(proposals);
    } catch (error: any) {
      console.error('Get project proposals error:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProjectController; 