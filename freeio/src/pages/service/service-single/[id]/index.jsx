import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";
import ServiceDetail1 from "@/components/section/ServiceDetail1";
import TabSection1 from "@/components/section/TabSection1";
import MetaComponent from "@/components/common/MetaComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useServiceStore from "@/store/serviceStore";
import { product1 } from "@/data/product";

export default function ServicePageSingle11() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchServiceById, isLoading, error } = useServiceStore();
  
  useEffect(() => {
    // For hardcoded ID=1 links, redirect to service listing page
    if (id === "1") {
      console.log("ServicePageSingle11 - Redirecting from hardcoded ID=1 to service-1 listing page");
      navigate("/service-1", { replace: true });
      return;
    }
    
    // Find the service based on ID from the URL
    if (id) {
      console.log("ServicePageSingle11 - Requested service ID:", id);
      
      const loadService = async () => {
        try {
          const serviceData = await fetchServiceById(id);
          console.log(`ServicePageSingle11 - Loaded service: ID=${id}, Title="${serviceData?.title}"`, serviceData);
          setService(serviceData);
          setLoading(false);
        } catch (err) {
          console.error("Error loading service:", err);
          
          // If API fails, try to find service directly from product1 data
          console.log("ServicePageSingle11 - Falling back to direct product1 lookup");
          const directFallbackService = product1.find(item => item.id == id);
          
          if (directFallbackService) {
            console.log(`ServicePageSingle11 - Found service directly in product1: ID=${id}, Title="${directFallbackService.title}"`);
            setService(directFallbackService);
          } else {
            console.error(`ServicePageSingle11 - Service ID ${id} not found in product1 data`);
            // Redirect to first available service if this one doesn't exist
            if (product1.length > 0) {
              console.log(`ServicePageSingle11 - Redirecting to first available service (ID=${product1[0].id})`);
              navigate(`/service-single/${product1[0].id}`, { replace: true });
              return;
            }
          }
          setLoading(false);
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
      ) : (
        <ServiceDetail1 serviceData={service} />
      )}
    </>
  );
}
