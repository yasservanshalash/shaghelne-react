import { useEffect, useState } from "react";
import useJobStore from "@/store/jobStore";
import useAuthStore from "@/store/authStore";
import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  MdModeEdit,
  MdDelete,
  MdOutlineVisibility,
  MdOutlineAdd,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import Pagination1 from "@/components/section/Pagination1";
import DashboardNavigation from "../header/DashboardNavigation";

function ManageJobs() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { fetchUserJobs, userJobs, deleteJob, isLoading, error } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, jobId: null });
  const [localError, setLocalError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Debug auth state
  useEffect(() => {
    // More detailed user debugging
    const userDetails = user ? {
      hasId: !!user._id,
      idType: typeof user._id,
      id: user._id,
      userId: user.id, // Some APIs use id instead of _id
      allUserProps: Object.keys(user)
    } : 'No user object';
    
    const authDebug = {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      user: userDetails
    };
    
    console.log("Auth Debug Info:", authDebug);
    setDebugInfo(authDebug);
  }, [user, token, isAuthenticated]);
  
  // Reset function to clear errors and reload
  const resetAndReload = () => {
    setLocalError(null);
    loadJobs();
  };
  
  // Force reload auth from localStorage
  const reloadAuth = () => {
    // This will force a page refresh, reloading auth from localStorage
    window.location.reload();
  };
  
  // Separate function to load jobs to make it reusable
  const loadJobs = async () => {
    if (!user) {
      setLocalError("User object is missing.");
      console.error("Auth missing: No user object");
      return;
    }
    
    if (!token) {
      setLocalError("Authentication token is required.");
      console.error("Auth missing: No token");
      return;
    }
    
    // Try both id and _id to handle different API conventions
    const userId = user._id || user.id;
    
    if (!userId) {
      setLocalError("User ID is required but missing in the user object.");
      console.error("Auth missing: User exists but has no ID", { user });
      return;
    }
    
    try {
      console.log("Attempting to fetch jobs with:", { 
        userId,
        tokenExists: !!token,
        tokenFirstChars: token.substring(0, 10)
      });
      
      await fetchUserJobs(userId, token);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setLocalError(err.message || "Failed to load jobs. Please try again.");
    }
  };
  
  // Fetch user's jobs when component mounts
  useEffect(() => {
    if (user && token) {
      console.log("Dependencies changed, calling loadJobs with user and token");
      loadJobs();
    }
  }, [user, token]); // Only depend on user and token, not the loadJobs function
  
  // Format job type by replacing underscores with spaces and capitalizing first letter of each word
  const formatJobType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  // Format salary as a readable string
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format created date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate expiry date (30 days from creation)
  const calculateExpiryDate = (createdAt) => {
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    return formatDate(expiryDate);
  };
  
  // Debug function to check network status
  const checkApiStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      console.log("Checking API status at:", apiUrl);
      
      const response = await fetch(`${apiUrl}/health`);
      const responseText = await response.text();
      return `API Status: ${response.status} ${response.statusText} - ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`;
    } catch (err) {
      console.error("API check error:", err);
      return `API Error: ${err.message}`;
    }
  };

  // Calculate current jobs to display (safely)
  const jobs = Array.isArray(userJobs) ? userJobs : [];
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle job deletion
  const handleDeleteConfirm = (jobId) => {
    setDeleteConfirm({ show: true, jobId });
  };
  
  const handleDeleteJob = async () => {
    if (deleteConfirm.jobId && token) {
      try {
        await deleteJob(deleteConfirm.jobId, token);
        setDeleteConfirm({ show: false, jobId: null });
      } catch (error) {
        console.error("Error deleting job:", error);
        setLocalError(`Failed to delete job: ${error.message}`);
      }
    }
  };

  // Handle authentication errors
  if (!isAuthenticated) {
    return (
      <div className="dashboard__content hover-bgc-color">
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
              <div className="alert alert-warning">
                <h5>Authentication Required</h5>
                <p>Please log in to view your jobs.</p>
                <div className="mt-3">
                  <Link to="/login" className="btn btn-primary">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <DashboardNavigation />
          </div>
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Manage Jobs</h2>
              <p className="text">Track, manage, and update your job listings</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
              {debugInfo && (!user || !token) && (
                <div className="alert alert-info mb-3">
                  <h6>Debug Information</h6>
                  <pre style={{ fontSize: '12px' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={reloadAuth}
                  >
                    Reload Authentication
                  </button>
                </div>
              )}
              
              {isLoading ? (
                <div className="d-flex justify-content-center my-5">
                  <Loader size="large" />
                </div>
              ) : localError || error ? (
                <div className="alert alert-danger">
                  <h5>Server Error</h5>
                  <p>{localError || error}</p>
                  
                  {debugInfo && (
                    <div className="mt-2 mb-3">
                      <h6>Auth Status:</h6>
                      <pre style={{ fontSize: '12px' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <button 
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={async () => {
                        const status = await checkApiStatus();
                        alert(status);
                      }}
                    >
                      Check API Status
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={resetAndReload}
                    >
                      Retry Loading
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-info"
                      onClick={reloadAuth}
                    >
                      Reload Authentication
                    </button>
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="d-flex flex-column align-items-center my-5">
                  <div className="alert alert-info text-center">
                    You haven't posted any jobs yet.
                  </div>
                  <Link 
                    to="/create-job" 
                    className="ud-btn btn-thm add-joining mt-3"
                  >
                    <MdOutlineAdd className="me-1" /> Post a Job
                  </Link>
                </div>
              ) : (
                <div className="packages_table table-responsive">
                  <table className="table-style3 table at-savesearch">
                    <thead className="t-head">
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Job Type</th>
                        <th scope="col">Salary</th>
                        <th scope="col">Created & Expired</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody className="t-body">
                      {currentJobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <div className="job-title-wrapper">
                              <h5 className="mb-0 text-truncate">
                                {job.title}
                              </h5>
                              <p className="text-truncate mb-0 fz14">
                                {job.company?.name || "No company specified"}
                              </p>
                            </div>
                          </td>
                          <td>{job.jobType ? formatJobType(job.jobType) : "-"}</td>
                          <td>{job.salary ? formatSalary(job.salary) : "-"}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>Created: {formatDate(job.createdAt)}</span>
                              <span>Expires: {calculateExpiryDate(job.createdAt)}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`
                              badge ${
                                job.status === 'OPEN' 
                                  ? 'badge-success text-white' 
                                  : job.status === 'CLOSED' 
                                  ? 'badge-danger text-white' 
                                  : 'badge-warning text-white'
                              }
                            `}>
                              {job.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Link 
                                to={`/job/${job._id}`}
                                className="icon-btn bg-light me-2"
                                title="View Job"
                              >
                                <MdOutlineVisibility />
                              </Link>
                              <Link 
                                to={`/edit-job/${job._id}`}
                                className="icon-btn bg-light me-2"
                                title="Edit Job"
                              >
                                <MdModeEdit />
                              </Link>
                              <button 
                                className="icon-btn bg-light"
                                title="Delete Job"
                                onClick={() => handleDeleteConfirm(job._id)}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {jobs.length > jobsPerPage && (
                    <div className="mt30">
                      <Pagination1
                        itemsPerPage={jobsPerPage}
                        totalItems={jobs.length}
                        paginate={paginate}
                        currentPage={currentPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setDeleteConfirm({ show: false, jobId: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this job? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setDeleteConfirm({ show: false, jobId: null })}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeleteJob}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageJobs; 