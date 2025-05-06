import { Request, Response } from 'express';
import JobService from '../services/jobService';

class JobController {
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
      
      const jobs = await JobService.getAll(filters);
      return res.status(200).json(jobs);
    } catch (error: any) {
      console.error('Get jobs error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await JobService.getById(id);
      return res.status(200).json(job);
    } catch (error: any) {
      console.error('Get job error:', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const jobData = req.body;
      
      // Validate required fields
      if (!jobData.title || !jobData.description || !jobData.budget || 
          !jobData.category || !jobData.deadline) {
        return res.status(400).json({ 
          message: 'Required fields: title, description, budget, category, deadline' 
        });
      }
      
      const job = await JobService.create(userId, jobData);
      return res.status(201).json(job);
    } catch (error: any) {
      console.error('Create job error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const jobData = req.body;
      
      // Find job first to verify ownership
      const job = await JobService.getById(id);
      
      // Verify ownership
      if (job.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only update your own jobs' });
      }
      
      const updatedJob = await JobService.update(id, jobData);
      return res.status(200).json(updatedJob);
    } catch (error: any) {
      console.error('Update job error:', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find job first to verify ownership
      const job = await JobService.getById(id);
      
      // Verify ownership
      if (job.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized - you can only delete your own jobs' });
      }
      
      await JobService.delete(id);
      return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error: any) {
      console.error('Delete job error:', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const jobs = await JobService.getByUser(userId);
      return res.status(200).json(jobs);
    } catch (error: any) {
      console.error('Get jobs by user error:', error);
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
      
      const jobs = await JobService.search(criteria);
      return res.status(200).json(jobs);
    } catch (error: any) {
      console.error('Search jobs error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getApplications(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Find job first to verify ownership
      const job = await JobService.getById(id);
      
      // Verify ownership
      if (job.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only view applications for your own jobs' 
        });
      }
      
      const applications = await JobService.getApplications(id);
      return res.status(200).json(applications);
    } catch (error: any) {
      console.error('Get job applications error:', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default JobController; 