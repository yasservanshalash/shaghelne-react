import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import ProjectDetail from "@/components/project/ProjectDetail";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import useProjectStore from "@/store/projectStore";
import { useParams } from "react-router-dom";
import Loader from "@/components/common/Loader";

export default function ProjectSinglePage() {
  const { id } = useParams();
  const { fetchProjectById, singleProject, isLoading, error } = useProjectStore();
  const [pageTitle, setPageTitle] = useState("Project Details");
  
  useEffect(() => {
    // Fetch project data when component mounts
    fetchProjectById(id);
  }, [id, fetchProjectById]);
  
  // Update meta title when project data loads
  useEffect(() => {
    if (singleProject) {
      setPageTitle(`${singleProject.title} - Project Details`);
    }
  }, [singleProject]);
  
  const metadata = {
    title: `Freeio - ${pageTitle}`,
  };
  
  if (isLoading && !singleProject) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Projects", "Loading..."]} />
        <div className="container py-5 my-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <Loader size="large" />
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (error && !singleProject) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Projects", "Error"]} />
        <div className="container py-5 my-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <button 
                className="ud-btn btn-thm mt20" 
                onClick={() => fetchProjectById(id)}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      {singleProject && (
        <>
          <Breadcumb3 path={["Home", "Projects", singleProject.title]} />
          <section className="pt-0">
            <div className="container">
              <div className="row wow fadeInUp" data-wow-delay="300ms">
                <div className="col-lg-8">
                  <ProjectDetail project={singleProject} />
                </div>
                <div className="col-lg-4">
                  <ProjectSidebar project={singleProject} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
