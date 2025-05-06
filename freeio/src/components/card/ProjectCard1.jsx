import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "../common/AuthContext";

export default function ProjectCard1({ data }) {
  const { isAuthenticated } = useAuth();
  
  // Format date to relative time
  const getRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  // If data comes from the backend, it will have different field names
  // compared to the static data
  const isBackendData = !!data._id;

  // Map data to a consistent format
  const projectData = isBackendData
    ? {
        id: data._id,
        title: data.title,
        img: data.userId?.profileImage || "/images/team/client-1.png", // Use user's profile image if available
        brief: data.description,
        location: data.userId?.location?.city || "Unknown Location",
        tags: data.skills || [],
        category: data.category,
        price: {
          min: data.budget,
          max: data.budget,
        },
        createdAt: data.createdAt,
        status: data.status,
      }
    : {
        ...data,
        createdAt: new Date().toISOString(),
      };

  return (
    <>
      <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
        <div className="col-lg-8 ps-0">
          <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
            <div className="thumb w60 position-relative rounded-circle mb15-md">
              <img
                className="rounded-circle mx-auto"
                src={projectData.img}
                alt="rounded-circle"
              />
              <span className="online-badge2" />
            </div>
            <div className="details ml15 ml0-md mb15-md">
              <h5 className="title mb-3">{projectData.title}</h5>
              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                <i className="flaticon-place fz16 vam text-thm2 me-1" />{" "}
                {projectData.location}
              </p>
              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />{" "}
                {getRelativeTime(projectData.createdAt)}
              </p>
              <p className="mb-0 fz14 list-inline-item mb5-sm">
                <i className="flaticon-contract fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />{" "}
                {projectData.status || "Open"}
              </p>
              <p className="text mt10">{projectData.brief}</p>
              <div className="skill-tags d-flex align-items-center justify-content-start flex-wrap">
                {Array.isArray(projectData.tags) && projectData.tags.map((item, i) => (
                  <span key={i} className={`tag ${i === 1 ? "mx10" : "me-10"}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
          <div className="details">
            <div className="text-lg-end">
              <h4>
                ${typeof projectData.price === 'object' 
                  ? `${projectData.price.min}${projectData.price.max !== projectData.price.min ? ` - $${projectData.price.max}` : ''}`
                  : projectData.price}
              </h4>
              <p className="text">Budget</p>
            </div>
            <div className="d-grid mt15">
              {isAuthenticated ? (
                <Link
                  to={`/project-single/${projectData.id}`}
                  className="ud-btn btn-light-thm"
                >
                  Send Proposal
                  <i className="fal fa-arrow-right-long" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ud-btn btn-light-thm"
                >
                  Login to Apply
                  <i className="fal fa-arrow-right-long" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
