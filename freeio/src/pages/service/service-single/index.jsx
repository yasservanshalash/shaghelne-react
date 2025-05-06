import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";
import ServiceDetail1 from "@/components/section/ServiceDetail1";
import TabSection1 from "@/components/section/TabSection1";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useServiceStore from "@/store/serviceStore";
import { product1 } from "@/data/product";

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
        console.log("Services loaded:", services);
        
        if (services && services.length > 0 && services[0].id) {
          console.log("Redirecting to service:", services[0]);
          navigate(`/service-single/${services[0].id}`, { replace: true });
        } else {
          // If no services from API, use fallback static data
          console.log("No services found from API, using fallback data");
          if (product1 && product1.length > 0) {
            navigate(`/service-single/${product1[0].id}`, { replace: true });
          } else {
            setError("No services available");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error loading first service:", error);
        setError("Failed to load services");
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
        <ServiceDetail1 />
      )}
    </>
  );
}
