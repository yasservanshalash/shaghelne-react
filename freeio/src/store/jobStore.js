import { create } from 'zustand';
import { jobService } from '../utils/api/jobService';

const useJobStore = create((set, get) => ({
  jobs: [],
  singleJob: null,
  userJobs: [],
  filteredJobs: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    minSalary: 0,
    maxSalary: 100000,
    status: 'OPEN',
    jobType: null,
    location: null,
    query: '',
  },

  // Fetch all jobs
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.getAllJobs();
      
      set({
        jobs: data,
        filteredJobs: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error fetching jobs:', error);
    }
  },

  // Fetch a single job by ID
  fetchJobById: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.getJobById(jobId);
      
      set({
        singleJob: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error fetching job:', error);
    }
  },

  // Fetch jobs by user ID
  fetchUserJobs: async (userId, token) => {
    set({ isLoading: true, error: null });
    try {
      if (!userId) {
        const errorMsg = "User ID is required";
        console.error(errorMsg);
        set({ 
          isLoading: false, 
          error: errorMsg,
          userJobs: [] 
        });
        throw new Error(errorMsg);
      }
      
      if (!token) {
        const errorMsg = "Authentication token is required";
        console.error(errorMsg);
        set({ 
          isLoading: false, 
          error: errorMsg,
          userJobs: [] 
        });
        throw new Error(errorMsg);
      }
      
      console.log(`Fetching jobs for user ${userId} with token: ${token.substring(0, 10)}...`);
      
      const data = await jobService.getJobsByUser(userId.toString(), token);
      
      // Ensure data is an array to prevent rendering errors
      const safeData = Array.isArray(data) ? data : [];
      
      console.log(`Fetched ${safeData.length} jobs successfully`);
      
      set({
        userJobs: safeData,
        isLoading: false,
      });
      
      return safeData;
    } catch (error) {
      console.error('Error fetching user jobs:', error);
      // Set a more descriptive error message
      const errorMessage = error.message || 'Failed to fetch user jobs. Please try again later.';
      set({ 
        isLoading: false, 
        error: errorMessage,
        userJobs: [] // Set empty array to prevent null/undefined issues
      });
      
      // Re-throw for component-level handling
      throw error;
    }
  },

  // Create a new job
  createJob: async (jobData, token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.createJob(jobData, token);
      
      // Add the new job to the jobs list
      set(state => ({
        jobs: [data, ...state.jobs],
        userJobs: [data, ...state.userJobs],
        isLoading: false,
      }));
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update a job
  updateJob: async (jobId, jobData, token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.updateJob(jobId, jobData, token);
      
      // Update the job in the jobs list
      set(state => ({
        jobs: state.jobs.map(job => 
          job._id === jobId ? data : job
        ),
        userJobs: state.userJobs.map(job => 
          job._id === jobId ? data : job
        ),
        singleJob: data,
        isLoading: false,
      }));
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (jobId, token) => {
    set({ isLoading: true, error: null });
    try {
      await jobService.deleteJob(jobId, token);
      
      // Remove the job from the jobs list
      set(state => ({
        jobs: state.jobs.filter(job => job._id !== jobId),
        userJobs: state.userJobs.filter(job => job._id !== jobId),
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Search jobs
  searchJobs: async (searchCriteria) => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.searchJobs(searchCriteria);
      
      set({
        filteredJobs: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error searching jobs:', error);
    }
  },

  // Set filters
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
    
    // Apply filters 
    get().applyFilters();
  },

  // Apply filters to jobs
  applyFilters: () => {
    const { jobs, filters } = get();
    
    let filtered = [...jobs];
    
    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }
    
    if (filters.minSalary > 0) {
      filtered = filtered.filter(job => job.salary >= filters.minSalary);
    }
    
    if (filters.maxSalary > 0) {
      filtered = filtered.filter(job => job.salary <= filters.maxSalary);
    }
    
    if (filters.status) {
      filtered = filtered.filter(job => job.status === filters.status);
    }
    
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters.location && filters.location.city) {
      filtered = filtered.filter(job => 
        job.location && job.location.city === filters.location.city
      );
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query)
      );
    }
    
    set({ filteredJobs: filtered });
  },

  // Clear filters
  clearFilters: () => {
    set(state => ({
      filters: {
        category: null,
        minSalary: 0,
        maxSalary: 100000,
        status: 'OPEN',
        jobType: null,
        location: null,
        query: '',
      },
      filteredJobs: state.jobs,
    }));
  },
}));

export default useJobStore; 