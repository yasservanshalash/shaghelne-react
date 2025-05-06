import { useEffect, useState } from "react";
import ProjectCard1 from "../card/ProjectCard1";
import ListingOption2 from "../element/ListingOption2";
import ListingSidebar2 from "../sidebar/ListingSidebar2";
import Pagination1 from "./Pagination1";
import ListingSidebarModal2 from "../modal/ListingSidebarModal2";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import useProjectStore from "@/store/projectStore";
import Loader from "../common/Loader";

export default function ProjectListing() {
  const {
    projects,
    filteredProjects,
    isLoading,
    error,
    fetchProjects,
    setFilters,
    clearFilters
  } = useProjectStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  
  // Get filter states from listing store for the sidebar filters
  const getCategory = listingStore((state) => state.getCategory);
  const getProjectType = listingStore((state) => state.getProjectType);
  const getPrice = priceStore((state) => state.priceRange);
  const getDesginTool = listingStore((state) => state.getDesginTool);
  const getLocation = listingStore((state) => state.getLocation);
  const getSearch = listingStore((state) => state.getSearch);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getBestSeller = listingStore((state) => state.getBestSeller);
  const getEnglishLevel = listingStore((state) => state.getEnglishLevel);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Update project store filters when listing store filters change
  useEffect(() => {
    // Map listing store filters to project store filters
    const filters = {};
    
    if (getCategory?.length > 0) {
      filters.category = getCategory[0]; // Use the first category
    }
    
    if (getPrice) {
      filters.minBudget = getPrice.min;
      filters.maxBudget = getPrice.max;
    }
    
    if (getDesginTool?.length > 0) {
      filters.skills = getDesginTool.map(skill => 
        skill.split('-').join(' ')
      );
    }
    
    if (getSearch) {
      filters.query = getSearch;
    }
    
    setFilters(filters);
  }, [
    getCategory, 
    getProjectType, 
    getPrice, 
    getDesginTool, 
    getLocation,
    getSearch,
    getSpeak,
    getBestSeller,
    getEnglishLevel,
    setFilters
  ]);

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading && projects.length === 0) {
    return (
      <section className="pt30 pb90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <Loader />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && projects.length === 0) {
    return (
      <section className="pt30 pb90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <button 
                className="ud-btn btn-thm mt20" 
                onClick={fetchProjects}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <ListingSidebar2 />
            </div>
            <div className="col-lg-9">
              <ListingOption2 itemLength={filteredProjects?.length} />
              
              {isLoading && (
                <div className="text-center my-4">
                  <Loader />
                </div>
              )}
              
              {!isLoading && filteredProjects.length === 0 ? (
                <div className="text-center my-5">
                  <div className="mb-4">
                    <img 
                      src="/images/no-result.svg" 
                      alt="No Projects Found" 
                      style={{ maxWidth: '150px' }} 
                    />
                  </div>
                  <h3>No Projects Found</h3>
                  <p className="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
                  <button 
                    className="ud-btn btn-thm mt20" 
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="row">
                  {currentProjects.map((project) => (
                    <div key={project._id} className="col-md-6 col-lg-12">
                      <ProjectCard1 data={project} />
                    </div>
                  ))}
                </div>
              )}
              
              {filteredProjects.length > projectsPerPage && (
                <div className="mt30">
                  <Pagination1 
                    currentPage={currentPage}
                    itemsPerPage={projectsPerPage}
                    totalItems={filteredProjects.length}
                    paginate={paginate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ListingSidebarModal2 />
    </>
  );
} 