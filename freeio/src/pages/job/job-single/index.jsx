import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import JobDetail from "@/components/job/JobDetail";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import useJobStore from "@/store/jobStore";
import { useParams } from "react-router-dom";
import Loader from "@/components/common/Loader";

export default function JobSinglePage() {
  const { id } = useParams();
  const { fetchJobById, singleJob, isLoading, error } = useJobStore();
  const [pageTitle, setPageTitle] = useState("Job Details");
  
  useEffect(() => {
    // Fetch job data when component mounts
    fetchJobById(id);
  }, [id, fetchJobById]);
  
  // Update meta title when job data loads
  useEffect(() => {
    if (singleJob) {
      setPageTitle(`${singleJob.title} - Job Details`);
    }
  }, [singleJob]);
  
  const metadata = {
    title: `Freeio - ${pageTitle}`,
  };
  
  if (isLoading && !singleJob) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Jobs", "Loading..."]} />
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
  
  if (error) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Jobs", "Error"]} />
        <div className="container py-5 my-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger text-center">
                <h4 className="alert-heading">Error</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                  Please try refreshing the page or go back to the jobs listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (!singleJob) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Jobs", "Not Found"]} />
        <div className="container py-5 my-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-warning text-center">
                <h4 className="alert-heading">Job Not Found</h4>
                <p>The job you're looking for couldn't be found or may have been removed.</p>
                <hr />
                <p className="mb-0">
                  Please check the job ID or go back to the jobs listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Jobs", singleJob.title]} />
      <div className="container py-5">
        <JobDetail job={singleJob} />
      </div>
    </>
  );
}
