import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useServiceStore from "@/store/serviceStore";

export default function ServiceDetailPrice1({ serviceData }) {
  const [getTab, setTab] = useState(0);
  const [packagePlans, setPackagePlans] = useState(null);
  const { id } = useParams();
  const { fetchServiceById } = useServiceStore();
  
  // Initialize with default data or use the passed in serviceData
  useEffect(() => {
    const loadData = async () => {
      try {
        let serviceInfo = serviceData;
        
        // If no service data is provided and we have an ID, fetch the service
        if (!serviceInfo && id) {
          serviceInfo = await fetchServiceById(id);
        }
        
        if (serviceInfo && serviceInfo.packagePlans) {
          setPackagePlans(serviceInfo.packagePlans);
        }
      } catch (error) {
        console.error("Error loading service data for pricing:", error);
      }
    };
    
    loadData();
  }, [serviceData, id, fetchServiceById]);
  
  // Define the tabs based on available package plans
  const tabs = packagePlans ? [
    packagePlans.basic?.title || "Basic",
    packagePlans.standard?.title || "Standard", 
    packagePlans.premium?.title || "Premium"
  ] : ["Basic", "Standard", "Premium"];
  
  // Helper function to get the current package plan based on the selected tab
  const getCurrentPlan = () => {
    if (!packagePlans) return null;
    
    switch (getTab) {
      case 0: return packagePlans.basic;
      case 1: return packagePlans.standard;
      case 2: return packagePlans.premium;
      default: return packagePlans.basic;
    }
  };
  
  const currentPlan = getCurrentPlan();

  return (
    <>
      <div className="price-widget">
        <div className="navtab-style1">
          <nav>
            <div className="nav nav-tabs mb20">
              {tabs.map((item, i) => (
                <button
                  onClick={() => setTab(i)}
                  key={i}
                  className={`nav-link fw500 ${getTab === i ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            <div className="price-content">
              <div className="price">${currentPlan?.price || (getTab === 0 ? 29 : getTab === 1 ? 49 : 89)}</div>
              <div className="h5 mb-2">{currentPlan?.title || `${tabs[getTab]} Package`}</div>
              <p className="text fz14">
                {currentPlan?.description || 
                  "I will redesign your current landing page or create one for you (upto 4 sections)"}
              </p>
              <hr className="opacity-100 mb20" />
              <ul className="p-0 mb15 d-sm-flex align-items-center">
                <li className="fz14 fw500 dark-color">
                  <i className="flaticon-sandclock fz20 text-thm2 me-2 vam" />
                  {currentPlan?.deliveryTime || 3} Days Delivery
                </li>
                <li className="fz14 fw500 dark-color ml20 ml0-xs">
                  <i className="flaticon-recycle fz20 text-thm2 me-2 vam" />
                  {currentPlan?.revisions || 2} Revisions
                </li>
              </ul>
              <div className="list-style1">
                <ul>
                  {(currentPlan?.features || ["2 Page / Screen", "Source file"]).map((feature, index) => (
                    <li key={index} className={index < (currentPlan?.features?.length || 2) - 1 ? "mb15" : ""}>
                      <i className="far fa-check text-thm3 bgc-thm3-light" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="d-grid">
                <a className="ud-btn btn-thm">
                  Continue ${currentPlan?.price || (getTab === 0 ? 29 : getTab === 1 ? 49 : 89)}
                  <i className="fal fa-arrow-right-long" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
