import { API_URL } from '../auth';

export const jobService = {
  /**
   * Fetch all jobs with optional filtering
   */
  getAllJobs: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minSalary) queryParams.append('minSalary', filters.minSalary);
      if (filters.maxSalary) queryParams.append('maxSalary', filters.maxSalary);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.location && filters.location.city) 
        queryParams.append('location.city', filters.location.city);
      
      const url = `${API_URL}/jobs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch jobs');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  
  /**
   * Fetch a single job by ID
   */
  getJobById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch job');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch jobs for a specific user
   */
  getJobsByUser: async (userId, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/jobs/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user jobs');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching jobs for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new job
   */
  createJob: async (jobData, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing job
   */
  updateJob: async (jobId, jobData, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating job with ID ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a job
   */
  deleteJob: async (jobId, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting job with ID ${jobId}:`, error);
      throw error;
    }
  },
  
  /**
   * Search jobs
   */
  searchJobs: async (searchCriteria = {}) => {
    try {
      // Build query string from search criteria
      const queryParams = new URLSearchParams();
      
      if (searchCriteria.query) queryParams.append('query', searchCriteria.query);
      if (searchCriteria.category) queryParams.append('category', searchCriteria.category);
      if (searchCriteria.minSalary) queryParams.append('minSalary', searchCriteria.minSalary);
      if (searchCriteria.maxSalary) queryParams.append('maxSalary', searchCriteria.maxSalary);
      if (searchCriteria.jobType) queryParams.append('jobType', searchCriteria.jobType);
      
      const response = await fetch(`${API_URL}/jobs/search/query?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search jobs');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },
  
  /**
   * Get job applications
   */
  getJobApplications: async (jobId, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch job applications');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching applications for job ${jobId}:`, error);
      throw error;
    }
  },
}; 