import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { MdOutlineBusinessCenter } from "react-icons/md";

export default function JobCard({ job }) {
  const {
    _id,
    title,
    company,
    jobType,
    salary,
    location,
    createdAt,
    status,
  } = job;

  // Format creation date as "2 days ago", "3 months ago", etc.
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

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
  
  return (
    <div className="job-card p-30 bdrs-12 position-relative mb-4 shadow-sm hover-shadow-1 cursor-pointer">
      {status !== "OPEN" && (
        <span className="badge badge-danger position-absolute top-0 end-0 mt-3 me-3">
          {status}
        </span>
      )}
      
      <div className="d-flex align-items-center">
        {company && company.logo ? (
          <img 
            className="mr-3 rounded-circle" 
            src={company.logo} 
            alt={company.name} 
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
          <Link to={`/job/${_id}`}>
            <h5 className="mb-1 text-dark">{title}</h5>
          </Link>
          <div className="company-name text-gray mb-2">
            {company ? company.name : "Company Not Specified"}
          </div>
          
          <div className="d-flex flex-wrap">
            {jobType && (
              <span className="badge bg-light text-dark me-2 mb-2">
                {formatJobType(jobType)}
              </span>
            )}
            
            {location && location.city && (
              <span className="me-3 mb-2 d-flex align-items-center text-gray">
                <IoLocationOutline className="me-1" />
                {location.city}
              </span>
            )}
            
            {salary && (
              <span className="me-3 mb-2 d-flex align-items-center text-gray">
                <HiOutlineCurrencyDollar className="me-1" />
                {formatSalary(salary)}
              </span>
            )}
            
            <span className="mb-2 d-flex align-items-center text-gray">
              <BsClockHistory className="me-1" />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 d-flex justify-content-end">
        <Link to={`/job/${_id}`} className="btn btn-sm btn-outline-primary">
          View Details
        </Link>
      </div>
    </div>
  );
} 