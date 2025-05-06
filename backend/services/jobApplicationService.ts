import JobApplication, { JobApplicationDocument, JobApplicationStatus } from '../models/JobApplication';
import Job from '../models/Job';

interface ApplicationFilters {
  status?: JobApplicationStatus;
  jobId?: string;
}

class JobApplicationService {
  static async getAll(filters: ApplicationFilters = {}) {
    let query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.jobId) {
      query.jobId = filters.jobId;
    }
    
    const applications = await JobApplication.find(query);
    return applications;
  }
  
  static async getById(applicationId: string) {
    const application = await JobApplication.findById(applicationId);
    
    if (!application) {
      throw new Error('Job application not found');
    }
    
    return application;
  }
  
  static async create(userId: string, jobId: string, data: Partial<JobApplicationDocument>) {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      userId,
      jobId
    });
    
    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }
    
    const application = await JobApplication.create({
      ...data,
      userId,
      jobId,
      status: JobApplicationStatus.PENDING
    });
    
    return application;
  }
  
  static async update(applicationId: string, data: Partial<JobApplicationDocument>) {
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { ...data },
      { new: true }
    );
    
    if (!application) {
      throw new Error('Job application not found');
    }
    
    return application;
  }
  
  static async withdraw(applicationId: string) {
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status: JobApplicationStatus.WITHDRAWN },
      { new: true }
    );
    
    if (!application) {
      throw new Error('Job application not found');
    }
    
    return application;
  }
  
  static async getByUser(userId: string) {
    const applications = await JobApplication.find({ userId });
    return applications;
  }
  
  static async approve(applicationId: string) {
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status: JobApplicationStatus.ACCEPTED },
      { new: true }
    );
    
    if (!application) {
      throw new Error('Job application not found');
    }
    
    return application;
  }
  
  static async reject(applicationId: string) {
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status: JobApplicationStatus.REJECTED },
      { new: true }
    );
    
    if (!application) {
      throw new Error('Job application not found');
    }
    
    return application;
  }
}

export default JobApplicationService; 