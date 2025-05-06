import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { BsBookmark, BsBookmarkFill, BsShare, BsFlag } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import useAuthStore from "@/store/authStore";

export default function JobDetail({ job }) {
  const [isSaved, setIsSaved] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Format creation date as "2 days ago", "3 months ago", etc.
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });

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

  const toggleSave = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsSaved(!isSaved);
  };
  
  const applyForJob = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if the user is the owner of the job
    if (user && user._id === job.userId) {
      alert("You cannot apply to your own job listing");
      return;
    }
    
    navigate(`/job/${job._id}/apply`);
  };

  return (
    <div className="job-detail-wrapper">
      {/* Job Header Section */}
      <div className="job-header bg-white rounded shadow-sm p-4 mb-4">
        <div className="d-sm-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-3 mb-sm-0">
            {job.company && job.company.logo ? (
              <img 
                className="mr-3 rounded-circle" 
                src={job.company.logo} 
                alt={job.company.name} 
                width="80" 
                height="80" 
              />
            ) : (
              <div className="mr-3 rounded-circle bg-light d-flex align-items-center justify-content-center" 
                   style={{ width: "80px", height: "80px" }}>
                <MdOutlineBusinessCenter size={40} className="text-primary" />
              </div>
            )}
            
            <div className="ms-3">
              <h4 className="mb-1">{job.title}</h4>
              <div className="d-flex flex-wrap">
                {job.company && (
                  <span className="me-3 mb-2 d-flex align-items-center">
                    <FaUserTie className="me-1" />
                    {job.company.name}
                  </span>
                )}
                
                {job.location && job.location.city && (
                  <span className="me-3 mb-2 d-flex align-items-center">
                    <IoLocationOutline className="me-1" />
                    {job.location.city}
                  </span>
                )}
                
                <span className="mb-2 d-flex align-items-center text-muted">
                  Posted {timeAgo}
                </span>
              </div>
            </div>
          </div>
          
          <div className="d-flex">
            <button 
              className="btn btn-outline-primary me-2" 
              onClick={toggleSave}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
            </button>
            
            <button 
              className="btn btn-outline-secondary me-2" 
              aria-label="Share job"
            >
              <BsShare />
            </button>
            
            <button 
              className="btn btn-outline-danger" 
              aria-label="Report job"
            >
              <BsFlag />
            </button>
          </div>
        </div>
      </div>
      
      {/* Job Details & Application */}
      <div className="row">
        <div className="col-lg-8">
          {/* Job Overview */}
          <div className="job-overview bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="mb-4">Job Overview</h5>
            
            <div className="row mb-4">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <div className="icon-box bg-light rounded p-3 me-3">
                    <MdOutlineBusinessCenter size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-muted small">Job Type</div>
                    <div className="fw-bold">{job.jobType ? formatJobType(job.jobType) : "Not specified"}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <div className="icon-box bg-light rounded p-3 me-3">
                    <HiOutlineCurrencyDollar size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-muted small">Salary</div>
                    <div className="fw-bold">{job.salary ? formatSalary(job.salary) : "Not specified"}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="d-flex align-items-center">
                  <div className="icon-box bg-light rounded p-3 me-3">
                    <IoLocationOutline size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-muted small">Location</div>
                    <div className="fw-bold">
                      {job.location && job.location.city 
                        ? `${job.location.city}${job.location.subCity ? `, ${job.location.subCity}` : ''}` 
                        : "Remote / Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <h5 className="mb-3">Job Description</h5>
            <div className="mb-4" dangerouslySetInnerHTML={{ __html: job.description }}></div>
            
            {/* Job Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <>
                <h5 className="mb-3">Requirements</h5>
                <ul className="mb-4">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          {/* Company Information */}
          {job.company && (
            <div className="company-info bg-white rounded shadow-sm p-4 mb-4">
              <h5 className="mb-4">About the Company</h5>
              
              <div className="d-flex align-items-center mb-3">
                {job.company.logo ? (
                  <img 
                    className="mr-3 rounded-circle" 
                    src={job.company.logo} 
                    alt={job.company.name} 
                    width="60" 
                    height="60" 
                  />
                ) : (
                  <div className="mr-3 rounded-circle bg-light d-flex align-items-center justify-content-center" 
                       style={{ width: "60px", height: "60px" }}>
                    <MdOutlineBusinessCenter size={30} className="text-primary" />
                  </div>
                )}
                
                <div className="ms-3">
                  <h6 className="mb-1">{job.company.name}</h6>
                  <div className="text-muted small">
                    {job.company.industry ? `Industry: ${job.company.industry}` : ""}
                    {job.company.size ? ` · Size: ${job.company.size}` : ""}
                  </div>
                </div>
              </div>
              
              {job.company.description && (
                <p>{job.company.description}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="col-lg-4">
          {/* Job Application */}
          <div className="job-application bg-white rounded shadow-sm p-4 mb-4 sticky-top" style={{ top: "20px" }}>
            <h5 className="mb-4">Apply for this Job</h5>
            
            {job.status !== "OPEN" ? (
              <div className="alert alert-warning">
                This job is no longer accepting applications.
              </div>
            ) : (
              <>
                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  onClick={applyForJob}
                >
                  Apply Now
                </button>
                
                <div className="text-center text-muted small">
                  or
                </div>
                
                <button className="btn btn-outline-primary btn-lg w-100 mt-3">
                  Save for Later
                </button>
              </>
            )}
          </div>
          
          {/* Similar Jobs */}
          <div className="similar-jobs bg-white rounded shadow-sm p-4">
            <h5 className="mb-4">Similar Jobs</h5>
            <div className="text-center py-4">
              <p className="text-muted">Similar jobs will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 