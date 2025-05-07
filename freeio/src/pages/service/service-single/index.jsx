import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";
import ServiceDetail1 from "@/components/section/ServiceDetail1";
import TabSection1 from "@/components/section/TabSection1";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useServiceStore from "@/store/serviceStore";

export default function ServicePageSingle1() {
  const navigate = useNavigate();
  const { fetchServices } = useServiceStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Redirect to the first service with ID
    const loadFirstService = async () => {
      try {
        console.log("Attempting to fetch services...");
        const { services } = await fetchServices({ limit: 10 });
        console.log("Services loaded:", services.map(s => ({ id: s.id, title: s.title })));
        
        if (services && services.length > 0 && services[0].id) {
          console.log("Redirecting to service:", services[0]);
          navigate(`/service-single/${services[0].id}`, { replace: true });
        } else {
          setError("No services available. Please ensure the API is running.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading first service:", error);
        setError("Failed to load services. Please ensure the API is running at http://localhost:5000/api/services");
        setLoading(false);
      }
    };
    
    loadFirstService();
  }, [navigate, fetchServices]);
  
  const metadata = {
    title: "Freeio - Service Details",
  };

  // If we're still on this page after trying to redirect, show loading or error
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Services", loading ? "Loading..." : "Error"]} />
      <Breadcumb8 title={error || "Loading service details..."} />
      
      {loading ? (
        <section className="pt50 pb90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt20">Loading service data, please wait...</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pt50 pb90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h3>Service Error</h3>
                <p className="mt20">{error}</p>
                <button className="ud-btn btn-thm mt20" onClick={() => navigate('/service-1')}>
                  View All Services
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
