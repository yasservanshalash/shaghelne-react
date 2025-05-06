import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from "../common/AuthContext";
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectDetail({ project }) {
  const { isAuthenticated, user } = useAuth();
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Calculate relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  
  // Check if the current user is the owner of this project
  const isProjectOwner = user && user.id === project.userId;

  return (
    <div className="service-single">
      <div className="service-single-top d-flex justify-content-between mb30">
        <div className="d-flex align-items-center mb20-sm">
          <div className="mr15">
            <img 
              className="wa" 
              src={project.userProfile?.profileImage || "/images/team/client-1.png"} 
              alt="user"
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <div className="ml15">
            <h6 className="mb-0">{project.userProfile?.name || "Client"}</h6>
            <p className="mb-0 fz14">Posted {getRelativeTime(project.createdAt)}</p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="freelancer-style1 text-end">
            <div className="price mb10">
              <h3>
                ${project.budget ? project.budget.toLocaleString() : "N/A"}
              </h3>
              <p className="mb-0 text">Budget</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="service-about">
        <h3>{project.title}</h3>
        
        {/* Project details */}
        <div className="project-stats d-flex flex-wrap gap-3 mb20">
          <span className="tag">
            <i className="flaticon-place me-1"></i> 
            {project.userProfile?.location?.city || "Remote"}
          </span>
          <span className="tag">
            <i className="flaticon-30-days me-1"></i> 
            Due: {formatDate(project.deadline)}
          </span>
          <span className="tag">
            <i className="flaticon-selection me-1"></i> 
            Status: {project.status}
          </span>
        </div>
        
        {/* Project description */}
        <div className="service-about mb60">
          <p className="text mb30">{project.description}</p>
        </div>
        
        {/* Skills required */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb20">
            <h4 className="mb-3">Skills Required</h4>
            <div className="d-flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span key={index} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
        
        {/* Attachments */}
        {project.attachments && project.attachments.length > 0 && (
          <div className="mb30">
            <h4 className="mb-3">Attachments</h4>
            <div className="d-flex flex-wrap gap-2">
              {project.attachments.map((file, index) => (
                <a 
                  key={index} 
                  href={file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tag"
                >
                  <i className="fas fa-paperclip me-1"></i> 
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Call to action buttons */}
        <div className="d-grid mt30">
          {isAuthenticated ? (
            <>
              {isProjectOwner ? (
                <div className="d-flex flex-wrap gap-2">
                  <Link 
                    to={`/dashboard/edit-project/${project._id}`} 
                    className="ud-btn btn-thm-outline"
                  >
                    Edit Project
                  </Link>
                  <Link 
                    to={`/dashboard/project-proposals/${project._id}`} 
                    className="ud-btn btn-thm"
                  >
                    View Proposals
                  </Link>
                </div>
              ) : (
                <button 
                  className="ud-btn btn-thm"
                  disabled={isSubmittingProposal}
                  onClick={() => setIsSubmittingProposal(true)}
                >
                  {isSubmittingProposal ? (
                    "Submitting Proposal..."
                  ) : (
                    <>
                      Submit Proposal <i className="fal fa-arrow-right-long"></i>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <Link to="/login" className="ud-btn btn-thm">
              Login to Submit Proposal <i className="fal fa-arrow-right-long"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 