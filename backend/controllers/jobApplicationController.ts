import { Request, Response } from 'express';
import JobApplicationService from '../services/jobApplicationService';
import JobService from '../services/jobService';

class JobApplicationController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status, jobId } = req.query;
      
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (jobId) filters.jobId = jobId as string;
      
      const applications = await JobApplicationService.getAll(filters);
      return res.status(200).json(applications);
    } catch (error: any) {
      console.error('Get applications error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const application = await JobApplicationService.getById(id);
      return res.status(200).json(application);
    } catch (error: any) {
      console.error('Get application error:', error);
      
      if (error.message === 'Application not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { jobId, coverLetter, proposedPrice } = req.body;
      
      // Validate required fields
      if (!jobId || !coverLetter) {
        return res.status(400).json({ 
          message: 'Required fields: jobId, coverLetter' 
        });
      }
      
      // Verify job exists
      try {
        await JobService.getById(jobId);
      } catch (error) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      const applicationData = {
        jobId,
        coverLetter,
        proposedPrice
      };
      
      const application = await JobApplicationService.create(userId, applicationData);
      return res.status(201).json(application);
    } catch (error: any) {
      console.error('Create application error:', error);
      
      if (error.message === 'You have already applied to this job') {
        return res.status(400).json({ message: error.message });
      }
      
      if (error.message === 'Job is not open for applications') {
        return res.status(400).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updateData = req.body;
      
      // Verify ownership
      const application = await JobApplicationService.getById(id);
      if (application.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only update your own applications' 
        });
      }
      
      // Can only update if application is pending
      if (application.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot update application that is not in pending status' 
        });
      }
      
      const updatedApplication = await JobApplicationService.update(id, updateData);
      return res.status(200).json(updatedApplication);
    } catch (error: any) {
      console.error('Update application error:', error);
      
      if (error.message === 'Application not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async withdraw(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Verify ownership
      const application = await JobApplicationService.getById(id);
      if (application.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only withdraw your own applications' 
        });
      }
      
      // Can only withdraw if application is pending
      if (application.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot withdraw application that is not in pending status' 
        });
      }
      
      await JobApplicationService.withdraw(id);
      return res.status(200).json({ message: 'Application withdrawn successfully' });
    } catch (error: any) {
      console.error('Withdraw application error:', error);
      
      if (error.message === 'Application not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const applications = await JobApplicationService.getByUser(userId);
      return res.status(200).json(applications);
    } catch (error: any) {
      console.error('Get user applications error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get application
      const application = await JobApplicationService.getById(id);
      
      // Get job to verify ownership
      const job = await JobService.getById(application.jobId);
      
      // Verify job ownership
      if (job.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only approve applications for your own jobs' 
        });
      }
      
      // Can only approve if application is pending
      if (application.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot approve application that is not in pending status' 
        });
      }
      
      const updatedApplication = await JobApplicationService.approve(id);
      return res.status(200).json(updatedApplication);
    } catch (error: any) {
      console.error('Approve application error:', error);
      
      if (error.message === 'Application not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async reject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get application
      const application = await JobApplicationService.getById(id);
      
      // Get job to verify ownership
      const job = await JobService.getById(application.jobId);
      
      // Verify job ownership
      if (job.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only reject applications for your own jobs' 
        });
      }
      
      // Can only reject if application is pending
      if (application.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot reject application that is not in pending status' 
        });
      }
      
      const updatedApplication = await JobApplicationService.reject(id);
      return res.status(200).json(updatedApplication);
    } catch (error: any) {
      console.error('Reject application error:', error);
      
      if (error.message === 'Application not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default JobApplicationController; 