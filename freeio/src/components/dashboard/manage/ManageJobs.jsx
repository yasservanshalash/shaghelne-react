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
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
import Loader from "@/components/common/Loader";
import Pagination1 from "@/components/section/Pagination1";

export default function ManageJobs() {
  const { user, token } = useAuthStore();
  const { fetchUserJobs, userJobs, deleteJob, isLoading, error } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, jobId: null });
  
  // Fetch user's jobs when component mounts
  useEffect(() => {
    if (user && token) {
      fetchUserJobs(user._id, token);
    }
  }, [user, token, fetchUserJobs]);
  
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
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply sorting
  const sortedJobs = [...userJobs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Calculate current jobs to display
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  
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
      }
    }
  };
  
  // Render sorting icon
  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <IoMdArrowRoundUp className="ms-1" />
        : <IoMdArrowRoundDown className="ms-1" />;
    }
    return null;
  };

  return (
    <>
      <DashboardHeader
        title="Manage Jobs"
        subtitle="Track, manage, and update your job listings"
      />
      
      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between align-items-center mb20">
              <h4 className="title fz17 mb15">Your Job Listings</h4>
              <Link 
                to="/create-job" 
                className="ud-btn btn-thm add-joining"
              >
                <MdOutlineAdd className="me-1" /> Post a Job
              </Link>
            </div>
            
            {isLoading ? (
              <div className="d-flex justify-content-center my-5">
                <Loader size="large" />
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : userJobs.length === 0 ? (
              <div className="alert alert-info">
                You haven't posted any jobs yet. Click "Post a Job" to create your first job listing.
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead className="thead-light">
                      <tr className="border-bottom">
                        <th 
                          scope="col" 
                          className="sortable-column"
                          onClick={() => handleSort('title')}
                        >
                          <div className="d-inline-flex align-items-center">
                            Job Title
                            {renderSortIcon('title')}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="sortable-column"
                          onClick={() => handleSort('jobType')}
                        >
                          <div className="d-inline-flex align-items-center">
                            Job Type
                            {renderSortIcon('jobType')}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="sortable-column"
                          onClick={() => handleSort('salary')}
                        >
                          <div className="d-inline-flex align-items-center">
                            Salary
                            {renderSortIcon('salary')}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="sortable-column"
                          onClick={() => handleSort('createdAt')}
                        >
                          <div className="d-inline-flex align-items-center">
                            Created
                            {renderSortIcon('createdAt')}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="sortable-column"
                          onClick={() => handleSort('status')}
                        >
                          <div className="d-inline-flex align-items-center">
                            Status
                            {renderSortIcon('status')}
                          </div>
                        </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentJobs.map((job) => (
                        <tr key={job._id} className="border-bottom">
                          <td>
                            <div className="job-title-wrapper">
                              <h5 className="mb-0">
                                <Link to={`/job/${job._id}`}>{job.title}</Link>
                              </h5>
                              <p className="text-truncate mb-0" style={{ maxWidth: '250px' }}>
                                {job.company?.name || "No company specified"}
                              </p>
                            </div>
                          </td>
                          <td>{job.jobType ? formatJobType(job.jobType) : "-"}</td>
                          <td>{job.salary ? formatSalary(job.salary) : "-"}</td>
                          <td>
                            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                          </td>
                          <td>
                            <span className={`
                              badge ${
                                job.status === 'OPEN' 
                                  ? 'bg-success' 
                                  : job.status === 'CLOSED' 
                                  ? 'bg-danger' 
                                  : 'bg-warning'
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
                </div>
                
                {userJobs.length > jobsPerPage && (
                  <div className="mt-3">
                    <Pagination1
                      itemsPerPage={jobsPerPage}
                      totalItems={userJobs.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  </div>
                )}
                
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
            )}
          </div>
        </div>
      </div>
    </>
  );
} 