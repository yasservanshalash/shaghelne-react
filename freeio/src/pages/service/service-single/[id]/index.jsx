import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";
import ServiceDetail1 from "@/components/section/ServiceDetail1";
import TabSection1 from "@/components/section/TabSection1";
import MetaComponent from "@/components/common/MetaComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useServiceStore from "@/store/serviceStore";

export default function ServicePageSingle11() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchServiceById, isLoading, error } = useServiceStore();
  
  // DEBUG: Log URL and parameters
  console.log(`ServicePageSingle11 - Component mounted with URL params:`, { 
    id, 
    type: typeof id,
    url: window.location.href,
    path: window.location.pathname
  });
  
  useEffect(() => {
    // Find the service based on ID from the URL
    if (id) {
      console.log("ServicePageSingle11 - Requested service ID:", id);
      
      const loadService = async () => {
        try {
          console.log(`ServicePageSingle11 - About to call fetchServiceById with ID: ${id}`);
          const serviceData = await fetchServiceById(id);
          console.log(`ServicePageSingle11 - Loaded service: ID=${id}, Title="${serviceData?.title}"`, serviceData);
          setService(serviceData);
          setLoading(false);
        } catch (err) {
          console.error("Error loading service:", err);
          setLoading(false);
          // Show error message to user instead of redirecting
        }
      };
      
      loadService();
    } else {
      console.log("ServicePageSingle11 - No service ID provided");
      setLoading(false);
    }
  }, [id, fetchServiceById, navigate]);
  
  // Create metadata with service title if available
  const metadata = {
    title: service 
      ? `Freeio - ${service.title}`
      : "Freeio - Service Details",
  };
  
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 
        path={["Home", "Services", service?.category || "Design & Creative"]} 
      />
      <Breadcumb8 title={service?.title || "Loading service..."} />
      
      {loading ? (
        <section className="pt50 pb90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt20">Loading service details, please wait...</p>
              </div>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="pt50 pb90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h3>Error Loading Service</h3>
                <p className="mt20">There was an error loading this service. Please ensure the API is running.</p>
                <button className="ud-btn btn-thm mt20" onClick={() => navigate('/service-1')}>
                  View All Services
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : !service ? (
        <section className="pt50 pb90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h3>Service Not Found</h3>
                <p className="mt20">The requested service could not be found.</p>
                <button className="ud-btn btn-thm mt20" onClick={() => navigate('/service-1')}>
                  View All Services
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <ServiceDetail1 serviceData={service} />
      )}
    </>
  );
}
