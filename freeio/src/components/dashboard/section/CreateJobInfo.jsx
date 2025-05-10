import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavigation from "../header/DashboardNavigation";
import useJobStore from "@/store/jobStore";
import useAuthStore from "@/store/authStore";
import JobForm from "./JobForm";

export default function CreateJobInfo() {
  const navigate = useNavigate();
  const { createJob, isLoading, error } = useJobStore();
  const { user, token } = useAuthStore();
  const [submitError, setSubmitError] = useState(null);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    salary: 0,
    jobType: "FULL_TIME",
    location: {
      city: "",
      subCity: "",
      specificArea: ""
    },
    category: "",
    subcategory: "",
    requirements: [],
    company: {
      name: "",
      size: "",
      industry: ""
    },
    status: "OPEN"
  });

  const handleJobDataChange = (newData) => {
    setJobData({...jobData, ...newData});
  };

  const validateJobData = () => {
    const errors = [];
    
    if (!jobData.title || jobData.title.trim() === "") {
      errors.push("Job title is required");
    }
    
    if (!jobData.description || jobData.description.trim() === "") {
      errors.push("Job description is required");
    }
    
    if (!jobData.salary || jobData.salary <= 0) {
      errors.push("Valid salary amount is required");
    }
    
    if (!jobData.category || jobData.category === "select" || jobData.category === "") {
      errors.push("Category is required");
    }
    
    if (!jobData.company?.name || jobData.company.name.trim() === "") {
      errors.push("Company name is required");
    }
    
    return errors;
  };

  const handlePublish = async () => {
    if (!token) {
      setSubmitError("You must be logged in to create a job.");
      return;
    }

    // Validate the job data
    const validationErrors = validateJobData();
    if (validationErrors.length > 0) {
      setSubmitError(`Please fix the following errors: ${validationErrors.join(', ')}`);
      return;
    }

    try {
      setSubmitError(null);
      
      // Make sure category isn't "select"
      const finalJobData = { 
        ...jobData,
        category: jobData.category === "select" ? "" : jobData.category
      };
      
      // Convert salary to number
      if (typeof finalJobData.salary === 'string') {
        finalJobData.salary = parseFloat(finalJobData.salary) || 0;
      }
      
      await createJob(finalJobData, token);
      navigate("/manage-jobs");
    } catch (err) {
      console.error("Error creating job:", err);
      setSubmitError(err.message || "Failed to create job. Please try again.");
    }
  };

  return (
    <>
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <DashboardNavigation />
          </div>
          <div className="col-lg-9">
            <div className="dashboard_title_area">
              <h2>Create Job</h2>
              <p className="text">Create a new job listing to find the perfect talent for your needs.</p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-lg-end">
              <button 
                className="ud-btn btn-dark"
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Save & Publish"}
                <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          </div>
        </div>
        
        {submitError && (
          <div className="alert alert-danger mb-4">{submitError}</div>
        )}
        
        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}
        
        <div className="row">
          <div className="col-xl-12">
            <JobForm 
              jobData={jobData} 
              onDataChange={handleJobDataChange} 
            />
          </div>
        </div>
      </div>
    </>
  );
} 