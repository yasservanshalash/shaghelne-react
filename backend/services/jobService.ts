import Job, { JobDocument, JobStatus, JobType } from '../models/Job';
import JobApplication from '../models/JobApplication';

interface JobFilters {
  category?: string;
  minSalary?: number;
  maxSalary?: number;
  jobType?: JobType;
  status?: JobStatus;
  location?: any;
}

interface SearchCriteria {
  query?: string;
  category?: string;
  jobType?: JobType;
  location?: any;
  minSalary?: number;
  maxSalary?: number;
}

class JobService {
  static async getAll(filters: JobFilters = {}) {
    let query: any = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.minSalary !== undefined) {
      query.salary = { $gte: filters.minSalary };
    }
    
    if (filters.maxSalary !== undefined) {
      query.salary = { ...query.salary, $lte: filters.maxSalary };
    }
    
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }
    
    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = JobStatus.OPEN; // Default to open jobs
    }
    
    if (filters.location && filters.location.city) {
      query['location.city'] = filters.location.city;
    }
    
    const jobs = await Job.find(query);
    return jobs;
  }
  
  static async getById(jobId: string) {
    const job = await Job.findById(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  }
  
  static async create(userId: string, data: Partial<JobDocument>) {
    const job = await Job.create({
      ...data,
      userId,
      status: JobStatus.OPEN
    });
    
    return job;
  }
  
  static async update(jobId: string, data: Partial<JobDocument>) {
    const job = await Job.findByIdAndUpdate(
      jobId,
      { ...data },
      { new: true }
    );
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  }
  
  static async delete(jobId: string) {
    const job = await Job.findByIdAndDelete(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return { message: 'Job deleted successfully' };
  }
  
  static async getByUser(userId: string) {
    const jobs = await Job.find({ userId });
    return jobs;
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
    
    if (criteria.jobType) {
      query.jobType = criteria.jobType;
    }
    
    if (criteria.location && criteria.location.city) {
      query['location.city'] = criteria.location.city;
    }
    
    if (criteria.minSalary !== undefined) {
      query.salary = { $gte: criteria.minSalary };
    }
    
    if (criteria.maxSalary !== undefined) {
      query.salary = { ...query.salary, $lte: criteria.maxSalary };
    }
    
    query.status = JobStatus.OPEN; // Only search open jobs
    
    const jobs = await Job.find(query);
    return jobs;
  }
  
  static async getApplications(jobId: string) {
    const applications = await JobApplication.find({ jobId });
    return applications;
  }
}

export default JobService; 