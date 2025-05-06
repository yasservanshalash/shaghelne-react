import { API_URL } from '../auth';

export const projectService = {
  /**
   * Fetch all projects with optional filtering
   */
  getAllProjects: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.skills && filters.skills.length) 
        queryParams.append('skills', filters.skills.join(','));
      
      const url = `${API_URL}/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch projects');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  /**
   * Fetch a single project by ID
   */
  getProjectById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch project');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch projects by user ID
   */
  getProjectsByUser: async (userId, token) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/projects/user/${userId}`, {
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user projects');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching projects for user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new project
   */
  createProject: async (projectData, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing project
   */
  updateProject: async (id, projectData, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a project
   */
  deleteProject: async (id, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Search projects
   */
  searchProjects: async (searchCriteria = {}) => {
    try {
      // Build query string from search criteria
      const queryParams = new URLSearchParams();
      
      if (searchCriteria.query) queryParams.append('query', searchCriteria.query);
      if (searchCriteria.category) queryParams.append('category', searchCriteria.category);
      if (searchCriteria.minBudget) queryParams.append('minBudget', searchCriteria.minBudget);
      if (searchCriteria.maxBudget) queryParams.append('maxBudget', searchCriteria.maxBudget);
      
      const response = await fetch(`${API_URL}/projects/search/query?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search projects');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  },
  
  /**
   * Get project proposals
   */
  getProjectProposals: async (projectId, token) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch(`${API_URL}/projects/${projectId}/proposals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch project proposals');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching proposals for project ${projectId}:`, error);
      throw error;
    }
  },
}; 