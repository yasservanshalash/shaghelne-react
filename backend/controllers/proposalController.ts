import { Request, Response } from 'express';
import ProposalService from '../services/proposalService';
import ProjectService from '../services/projectService';

class ProposalController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status, projectId } = req.query;
      
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (projectId) filters.projectId = projectId as string;
      
      const proposals = await ProposalService.getAll(filters);
      return res.status(200).json(proposals);
    } catch (error: any) {
      console.error('Get proposals error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const proposal = await ProposalService.getById(id);
      return res.status(200).json(proposal);
    } catch (error: any) {
      console.error('Get proposal error:', error);
      
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { projectId, coverLetter, proposedPrice } = req.body;
      
      // Validate required fields
      if (!projectId || !coverLetter || !proposedPrice) {
        return res.status(400).json({ 
          message: 'Required fields: projectId, coverLetter, proposedPrice' 
        });
      }
      
      // Verify project exists
      try {
        await ProjectService.getById(projectId);
      } catch (error) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      const proposalData = {
        projectId,
        coverLetter,
        proposedPrice
      };
      
      const proposal = await ProposalService.create(userId, proposalData);
      return res.status(201).json(proposal);
    } catch (error: any) {
      console.error('Create proposal error:', error);
      
      if (error.message === 'You have already submitted a proposal for this project') {
        return res.status(400).json({ message: error.message });
      }
      
      if (error.message === 'Project is not open for proposals') {
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
      const proposal = await ProposalService.getById(id);
      if (proposal.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only update your own proposals' 
        });
      }
      
      // Can only update if proposal is pending
      if (proposal.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot update proposal that is not in pending status' 
        });
      }
      
      const updatedProposal = await ProposalService.update(id, updateData);
      return res.status(200).json(updatedProposal);
    } catch (error: any) {
      console.error('Update proposal error:', error);
      
      if (error.message === 'Proposal not found') {
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
      const proposal = await ProposalService.getById(id);
      if (proposal.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only withdraw your own proposals' 
        });
      }
      
      // Can only withdraw if proposal is pending
      if (proposal.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot withdraw proposal that is not in pending status' 
        });
      }
      
      await ProposalService.withdraw(id);
      return res.status(200).json({ message: 'Proposal withdrawn successfully' });
    } catch (error: any) {
      console.error('Withdraw proposal error:', error);
      
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const proposals = await ProposalService.getByUser(userId);
      return res.status(200).json(proposals);
    } catch (error: any) {
      console.error('Get user proposals error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async getByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user.id;
      
      // Get project to verify ownership
      const project = await ProjectService.getById(projectId);
      
      // Verify project ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only view proposals for your own projects' 
        });
      }
      
      const proposals = await ProposalService.getByProject(projectId);
      return res.status(200).json(proposals);
    } catch (error: any) {
      console.error('Get project proposals error:', error);
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get proposal
      const proposal = await ProposalService.getById(id);
      
      // Get project to verify ownership
      const project = await ProjectService.getById(proposal.projectId);
      
      // Verify project ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only approve proposals for your own projects' 
        });
      }
      
      // Can only approve if proposal is pending
      if (proposal.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot approve proposal that is not in pending status' 
        });
      }
      
      const updatedProposal = await ProposalService.approve(id);
      return res.status(200).json(updatedProposal);
    } catch (error: any) {
      console.error('Approve proposal error:', error);
      
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async reject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get proposal
      const proposal = await ProposalService.getById(id);
      
      // Get project to verify ownership
      const project = await ProjectService.getById(proposal.projectId);
      
      // Verify project ownership
      if (project.userId.toString() !== userId) {
        return res.status(403).json({ 
          message: 'Unauthorized - you can only reject proposals for your own projects' 
        });
      }
      
      // Can only reject if proposal is pending
      if (proposal.status !== 'pending') {
        return res.status(400).json({ 
          message: 'Cannot reject proposal that is not in pending status' 
        });
      }
      
      const updatedProposal = await ProposalService.reject(id);
      return res.status(200).json(updatedProposal);
    } catch (error: any) {
      console.error('Reject proposal error:', error);
      
      if (error.message === 'Proposal not found') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Project not found') {
        return res.status(404).json({ message: error.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProposalController; 