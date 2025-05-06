import Project, { ProjectDocument, ProjectStatus } from '../models/Project';
import Proposal from '../models/Proposal';

interface ProjectFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: ProjectStatus;
  skills?: string[];
}

interface SearchCriteria {
  query?: string;
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  skills?: string[];
}

class ProjectService {
  static async getAll(filters: ProjectFilters = {}) {
    let query: any = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.minBudget !== undefined) {
      query.budget = { $gte: filters.minBudget };
    }
    
    if (filters.maxBudget !== undefined) {
      query.budget = { ...query.budget, $lte: filters.maxBudget };
    }
    
    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = ProjectStatus.OPEN; // Default to open projects
    }
    
    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }
    
    const projects = await Project.find(query);
    return projects;
  }
  
  static async getById(projectId: string) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  }
  
  static async create(userId: string, data: Partial<ProjectDocument>) {
    const project = await Project.create({
      ...data,
      userId,
      status: ProjectStatus.OPEN
    });
    
    return project;
  }
  
  static async update(projectId: string, data: Partial<ProjectDocument>) {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { ...data },
      { new: true }
    );
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  }
  
  static async delete(projectId: string) {
    const project = await Project.findByIdAndDelete(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return { message: 'Project deleted successfully' };
  }
  
  static async getByUser(userId: string) {
    const projects = await Project.find({ userId });
    return projects;
  }
  
  static async search(criteria: SearchCriteria) {
    let query: any = {};
    
    if (criteria.query) {
      query.$or = [
        { title: { $regex: criteria.query, $options: 'i' } },
        { description: { $regex: criteria.query, $options: 'i' } }
      ];
    }
    
    if (criteria.category) {
      query.category = criteria.category;
    }
    
    if (criteria.minBudget !== undefined) {
      query.budget = { $gte: criteria.minBudget };
    }
    
    if (criteria.maxBudget !== undefined) {
      query.budget = { ...query.budget, $lte: criteria.maxBudget };
    }
    
    if (criteria.skills && criteria.skills.length > 0) {
      query.skills = { $in: criteria.skills };
    }
    
    query.status = ProjectStatus.OPEN; // Only search open projects
    
    const projects = await Project.find(query);
    return projects;
  }
  
  static async getProposals(projectId: string) {
    const proposals = await Proposal.find({ projectId });
    return proposals;
  }
}

export default ProjectService; 