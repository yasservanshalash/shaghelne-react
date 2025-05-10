import { useState, useEffect } from "react";
import SelectInput from "../option/SelectInput";

export default function JobForm({ jobData, onDataChange }) {
  const [category, setCategory] = useState({
    option: jobData.category || "Select",
    value: jobData.category || "select",
  });
  
  const [jobType, setJobType] = useState({
    option: formatJobType(jobData.jobType) || "Full Time",
    value: jobData.jobType || "FULL_TIME",
  });
  
  const [requirements, setRequirements] = useState(jobData.requirements || []);
  const [newRequirement, setNewRequirement] = useState("");
  
  // Format job type for display
  function formatJobType(type) {
    if (!type) return "Full Time";
    
    const formattedTypes = {
      FULL_TIME: "Full Time",
      PART_TIME: "Part Time",
      CONTRACT: "Contract",
      FREELANCE: "Freelance",
      INTERNSHIP: "Internship"
    };
    
    return formattedTypes[type] || "Full Time";
  }
  
  // Reverse format for saving
  function reverseFormatJobType(displayType) {
    const typeMap = {
      "Full Time": "FULL_TIME",
      "Part Time": "PART_TIME",
      "Contract": "CONTRACT",
      "Freelance": "FREELANCE",
      "Internship": "INTERNSHIP"
    };
    
    return typeMap[displayType] || "FULL_TIME";
  }
  
  // Handlers
  const categoryHandler = (option, value) => {
    setCategory({ option, value });
    if (value !== "select") {
      onDataChange({ category: value });
    } else {
      onDataChange({ category: "" });
    }
  };
  
  const jobTypeHandler = (option, value) => {
    setJobType({ option, value });
    onDataChange({ jobType: reverseFormatJobType(option) });
  };
  
  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      setRequirements(updatedRequirements);
      onDataChange({ requirements: updatedRequirements });
      setNewRequirement("");
    }
  };
  
  const removeRequirement = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    onDataChange({ requirements: updatedRequirements });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      onDataChange({ 
        [parent]: { 
          ...jobData[parent], 
          [child]: value 
        } 
      });
    } else {
      onDataChange({ [name]: value });
    }
  };

  return (
    <>
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Job Information</h5>
        </div>
        <div className="col-xl-8">
          <form className="form-style1">
            <div className="row">
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Job Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter job title"
                    name="title"
                    value={jobData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <SelectInput
                    label={<>Category <span className="text-danger">*</span></>}
                    defaultSelect={category}
                    handler={categoryHandler}
                    data={[
                      {
                        option: "Select",
                        value: "select",
                      },
                      {
                        option: "Development & IT",
                        value: "Development & IT",
                      },
                      {
                        option: "Design & Creative",
                        value: "Design & Creative",
                      },
                      {
                        option: "Digital Marketing",
                        value: "Digital Marketing",
                      },
                      {
                        option: "Writing & Translation",
                        value: "Writing & Translation",
                      },
                      {
                        option: "Music & Audio",
                        value: "Music & Audio",
                      },
                      {
                        option: "Video & Animation",
                        value: "Video & Animation",
                      },
                      {
                        option: "Finance & Accounting",
                        value: "Finance & Accounting",
                      },
                    ]}
                  />
                </div>
              </div>
              
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Web Development"
                    name="subcategory"
                    value={jobData.subcategory}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <SelectInput
                    label="Job Type"
                    defaultSelect={jobType}
                    handler={jobTypeHandler}
                    data={[
                      {
                        option: "Full Time",
                        value: "full-time",
                      },
                      {
                        option: "Part Time",
                        value: "part-time",
                      },
                      {
                        option: "Contract",
                        value: "contract",
                      },
                      {
                        option: "Freelance",
                        value: "freelance",
                      },
                      {
                        option: "Internship",
                        value: "internship",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Salary (USD) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount in USD"
                    name="salary"
                    value={jobData.salary}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleInputChange({
                        target: { name: 'salary', value }
                      });
                    }}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Job Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Describe the job responsibilities, ideal candidate, and other details"
                    name="description"
                    value={jobData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Job Requirements</h5>
        </div>
        <div className="col-xl-8">
          <form className="form-style1">
            <div className="row">
              <div className="col-12 mb20">
                <label className="heading-color ff-heading fw500 mb10">
                  Add Requirements
                </label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="E.g., 3+ years of experience"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <button 
                    type="button" 
                    className="ud-btn btn-thm"
                    onClick={addRequirement}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Display Requirements */}
              {requirements.length > 0 && (
                <div className="col-12 mb20">
                  <ul className="skills-list">
                    {requirements.map((req, index) => (
                      <li key={index} className="d-flex justify-content-between align-items-center mb2">
                        <span>{req}</span>
                        <button 
                          type="button" 
                          className="close-btn" 
                          onClick={() => removeRequirement(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Company Information */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Company Information</h5>
        </div>
        <div className="col-xl-8">
          <form className="form-style1">
            <div className="row">
              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter company name"
                    name="company.name"
                    value={jobData.company?.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Company Size
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., 10-50 employees"
                    name="company.size"
                    value={jobData.company?.size || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Industry
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Software Development"
                    name="company.industry"
                    value={jobData.company?.industry || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Location Information */}
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Job Location</h5>
        </div>
        <div className="col-xl-8">
          <form className="form-style1">
            <div className="row">
              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., New York"
                    name="location.city"
                    value={jobData.location?.city || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Area/Neighborhood
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Downtown"
                    name="location.subCity"
                    value={jobData.location?.subCity || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="col-sm-12">
                <div className="mb20">
                  <label className="heading-color ff-heading fw500 mb10">
                    Specific Address (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., 123 Main Street"
                    name="location.specificArea"
                    value={jobData.location?.specificArea || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 