import Proposal, { ProposalDocument, ProposalStatus } from '../models/Proposal';
import Project, { ProjectStatus } from '../models/Project';

interface ProposalFilters {
  status?: ProposalStatus;
  projectId?: string;
}

class ProposalService {
  static async getAll(filters: ProposalFilters = {}) {
    let query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.projectId) {
      query.projectId = filters.projectId;
    }
    
    const proposals = await Proposal.find(query);
    return proposals;
  }
  
  static async getById(proposalId: string) {
    const proposal = await Proposal.findById(proposalId);
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    return proposal;
  }
  
  static async create(userId: string, projectId: string, data: Partial<ProposalDocument>) {
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Check if project is open
    if (project.status !== ProjectStatus.OPEN) {
      throw new Error('Cannot submit proposal to a closed project');
    }
    
    // Check if user already submitted a proposal
    const existingProposal = await Proposal.findOne({
      userId,
      projectId
    });
    
    if (existingProposal) {
      throw new Error('You have already submitted a proposal for this project');
    }
    
    const proposal = await Proposal.create({
      ...data,
      userId,
      projectId,
      status: ProposalStatus.PENDING
    });
    
    return proposal;
  }
  
  static async update(proposalId: string, data: Partial<ProposalDocument>) {
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { ...data },
      { new: true }
    );
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    return proposal;
  }
  
  static async withdraw(proposalId: string) {
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: ProposalStatus.WITHDRAWN },
      { new: true }
    );
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    return proposal;
  }
  
  static async getByUser(userId: string) {
    const proposals = await Proposal.find({ userId });
    return proposals;
  }
  
  static async getByProject(projectId: string) {
    const proposals = await Proposal.find({ projectId });
    return proposals;
  }
  
  static async approve(proposalId: string) {
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: ProposalStatus.ACCEPTED },
      { new: true }
    );
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    // Update project status
    await Project.findByIdAndUpdate(
      proposal.projectId,
      { status: ProjectStatus.IN_PROGRESS }
    );
    
    return proposal;
  }
  
  static async reject(proposalId: string) {
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: ProposalStatus.REJECTED },
      { new: true }
    );
    
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    return proposal;
  }
}

export default ProposalService; 