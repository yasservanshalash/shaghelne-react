import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ProjectSidebar({ project }) {
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="blog-sidebar ms-lg-auto">
      {/* Project Card */}
      <div className="freelancer-style1 service-single mb30 bdrs16 overflow-hidden">
        <div className="card-body p25 px30 pb10">
          <h4 className="card-title mb20">Project Summary</h4>
          
          <div className="project-info mb10">
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Price</p>
              <p className="mb-0 dark-color fw500">${project.budget?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Category</p>
              <p className="mb-0 dark-color fw500">{project.category || 'N/A'}</p>
            </div>
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Deadline</p>
              <p className="mb-0 dark-color fw500">{formatDate(project.deadline)}</p>
            </div>
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Status</p>
              <p className="mb-0 dark-color fw500">{project.status || 'Open'}</p>
            </div>
            {project.subcategory && (
              <div className="d-flex justify-content-between mb15">
                <p className="mb-0 text-thm2 fw500">Subcategory</p>
                <p className="mb-0 dark-color fw500">{project.subcategory}</p>
              </div>
            )}
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Posted</p>
              <p className="mb-0 dark-color fw500">{formatDate(project.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Card */}
      <div className="freelancer-style1 service-single mb30 bdrs16 overflow-hidden">
        <div className="card-body p25 px30">
          <h4 className="card-title mb20">Share This Project</h4>
          <div className="social-style1">
            <a className="text-center" href="#">
              <i className="fab fa-facebook-f" />
            </a>
            <a className="text-center" href="#">
              <i className="fab fa-twitter" />
            </a>
            <a className="text-center" href="#">
              <i className="fab fa-instagram" />
            </a>
            <a className="text-center" href="#">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Client Card */}
      {project.userProfile && (
        <div className="freelancer-style1 service-single mb30 bdrs16 overflow-hidden">
          <div className="card-body p25 px30 pb10">
            <h4 className="card-title mb20">About the Client</h4>
            <div className="d-flex align-items-center mb20">
              <div className="mr15">
                <img 
                  className="wa" 
                  src={project.userProfile.profileImage || "/images/team/client-1.png"} 
                  alt="user"
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div className="ml15">
                <h5 className="mb-0">{project.userProfile.name}</h5>
                <p className="mb-0 fz14">{project.userProfile.title || 'Project Owner'}</p>
              </div>
            </div>
            
            <div className="d-flex justify-content-between mb15">
              <p className="mb-0 text-thm2 fw500">Member Since</p>
              <p className="mb-0 dark-color fw500">{formatDate(project.userProfile.createdAt || project.createdAt)}</p>
            </div>
            
            {project.userProfile.location && (
              <div className="d-flex justify-content-between mb15">
                <p className="mb-0 text-thm2 fw500">Location</p>
                <p className="mb-0 dark-color fw500">
                  {project.userProfile.location.city}, {project.userProfile.location.country}
                </p>
              </div>
            )}
            
            {project.userProfile.rating && (
              <div className="d-flex justify-content-between mb15">
                <p className="mb-0 text-thm2 fw500">Rating</p>
                <p className="mb-0 dark-color fw500">
                  <span className="text-warning me-1">
                    <i className="fas fa-star"></i>
                  </span>
                  {project.userProfile.rating}
                </p>
              </div>
            )}
            
            <div className="d-grid mt20">
              <Link 
                to={`/freelancer/${project.userId}`} 
                className="ud-btn btn-light-thm"
              >
                View Profile
                <i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Similar Projects */}
      <div className="bdrs16 overflow-hidden">
        <div className="card-body p-0">
          <h4 className="card-title mb20">Similar Projects</h4>
          <div className="text-center mt20">
            <Link to="/project-1" className="ud-btn btn-white2">
              Browse All Projects
              <i className="fal fa-arrow-right-long"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 