import { useEffect, useState } from "react";
import JobCard from "../card/JobCard";
import ListingOption2 from "../element/ListingOption2";
import ListingSidebar2 from "../sidebar/ListingSidebar2";
import Pagination1 from "./Pagination1";
import ListingSidebarModal2 from "../modal/ListingSidebarModal2";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import useJobStore from "@/store/jobStore";
import Loader from "../common/Loader";

export default function JobListing() {
  const {
    jobs,
    filteredJobs,
    isLoading,
    error,
    fetchJobs,
    setFilters,
    clearFilters
  } = useJobStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  
  // Get filter states from listing store for the sidebar filters
  const getCategory = listingStore((state) => state.getCategory);
  const getJobType = listingStore((state) => state.getJobType);
  const getSalaryRange = priceStore((state) => state.priceRange);
  const getLocation = listingStore((state) => state.getLocation);
  const getSearch = listingStore((state) => state.getSearch);
  const getCompanySize = listingStore((state) => state.getNoOfEmployee);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Update job store filters when listing store filters change
  useEffect(() => {
    setFilters({
      category: getCategory.length > 0 ? getCategory[0] : null,
      minSalary: getSalaryRange.min,
      maxSalary: getSalaryRange.max,
      jobType: getJobType.length > 0 ? getJobType[0] : null,
      location: getLocation.length > 0 ? { city: getLocation[0] } : null,
      query: getSearch,
    });
  }, [
    getCategory,
    getJobType,
    getSalaryRange,
    getLocation,
    getSearch,
    setFilters,
  ]);

  // Calculate current jobs to display
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sorting
  const handleSort = (sortOption) => {
    console.log("Sort option:", sortOption);
    // Implementation would depend on the sort options available
  };

  // Handle error display
  if (error) {
    return (
      <div className="alert alert-danger my-5">
        Error loading jobs: {error}
      </div>
    );
  }

  return (
    <section className="pt60 pb90">
      <div className="container">
        <div className="row">
          <div className="col-xl-3">
            <ListingSidebar2 
              title="Jobs"
              showJobTypeFilter={true}
              showLocationFilter={true}
              showCompanySizeFilter={true}
            />
          </div>
          <div className="col-xl-9">
            <div className="row align-items-center mb20">
              <div className="col-sm-6">
                <ListingOption2 
                  data={filteredJobs} 
                  itemsPerPage={jobsPerPage}
                  currentPage={currentPage}
                  customTitle="Jobs"
                  onSort={handleSort}
                />
              </div>
              <div className="col-sm-6">
                <div className="page_control_shorting d-flex align-items-center justify-content-sm-end">
                  <div className="pcs_dropdown d-flex align-items-center">
                    <span>Sort by</span>
                    <select className="form-select">
                      <option>Newest</option>
                      <option>Best Rated</option>
                      <option>Most Viewed</option>
                      <option>Most Contacted</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="d-flex justify-content-center my-5">
                <Loader size="large" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="alert alert-info my-5">
                No jobs found matching your criteria. Try adjusting your filters.
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  {currentJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                  
                  <div className="mt-5">
                    <Pagination1
                      itemsPerPage={jobsPerPage}
                      totalItems={filteredJobs.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ListingSidebarModal2 />
    </section>
  );
} 