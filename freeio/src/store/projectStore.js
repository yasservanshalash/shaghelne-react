import { create } from 'zustand';
import { projectService } from '../utils/api/projectService';

const useProjectStore = create((set, get) => ({
  projects: [],
  singleProject: null,
  userProjects: [],
  filteredProjects: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    minBudget: 0,
    maxBudget: 10000,
    status: 'OPEN',
    skills: [],
    query: '',
  },

  // Fetch all projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getAllProjects();
      
      set({
        projects: data,
        filteredProjects: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error fetching projects:', error);
    }
  },

  // Fetch a single project by ID
  fetchProjectById: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getProjectById(projectId);
      
      set({
        singleProject: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error fetching project:', error);
    }
  },

  // Fetch projects by user ID
  fetchUserProjects: async (userId, token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getProjectsByUser(userId, token);
      
      set({
        userProjects: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error fetching user projects:', error);
    }
  },

  // Create a new project
  createProject: async (projectData, token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.createProject(projectData, token);
      
      // Add the new project to the projects list
      set(state => ({
        projects: [data, ...state.projects],
        userProjects: [data, ...state.userProjects],
        isLoading: false,
      }));
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update a project
  updateProject: async (projectId, projectData, token) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.updateProject(projectId, projectData, token);
      
      // Update the project in the projects list
      set(state => ({
        projects: state.projects.map(project => 
          project._id === projectId ? data : project
        ),
        userProjects: state.userProjects.map(project => 
          project._id === projectId ? data : project
        ),
        singleProject: data,
        isLoading: false,
      }));
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete a project
  deleteProject: async (projectId, token) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(projectId, token);
      
      // Remove the project from the projects list
      set(state => ({
        projects: state.projects.filter(project => project._id !== projectId),
        userProjects: state.userProjects.filter(project => project._id !== projectId),
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Search projects
  searchProjects: async (searchCriteria) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.searchProjects(searchCriteria);
      
      set({
        filteredProjects: data,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error('Error searching projects:', error);
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

  // Apply filters to projects
  applyFilters: () => {
    const { projects, filters } = get();
    
    let filtered = [...projects];
    
    if (filters.category) {
      filtered = filtered.filter(project => project.category === filters.category);
    }
    
    if (filters.minBudget > 0) {
      filtered = filtered.filter(project => project.budget >= filters.minBudget);
    }
    
    if (filters.maxBudget > 0) {
      filtered = filtered.filter(project => project.budget <= filters.maxBudget);
    }
    
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }
    
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(project => 
        filters.skills.some(skill => project.skills && project.skills.includes(skill))
      );
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query)
      );
    }
    
    set({ filteredProjects: filtered });
  },

  // Clear filters
  clearFilters: () => {
    set(state => ({
      filters: {
        category: null,
        minBudget: 0,
        maxBudget: 10000,
        status: 'OPEN',
        skills: [],
        query: '',
      },
      filteredProjects: state.projects,
    }));
  },
}));

export default useProjectStore; 