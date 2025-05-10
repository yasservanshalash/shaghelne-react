import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageJobs from "@/components/dashboard/manage/ManageJobs";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/common/Loader";

export default function ManageJobsPage() {
  const { isAuthenticated, user, token, isLoading } = useAuthStore();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [authFixed, setAuthFixed] = useState(false);
  const navigate = useNavigate();
  
  // Function to manually fix user._id if it's missing
  const fixAuthState = () => {
    if (user && !user._id && user.id) {
      // If user has id but no _id property, add it
      console.log("Fixing user object by adding _id property");
      user._id = user.id;
      setAuthFixed(true);
      // Force a reload to apply the fix
      window.location.reload();
    } else {
      alert("Cannot fix user object. Try logging out and logging in again.");
    }
  };
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && (!isAuthenticated || !user || !token)) {
      navigate("/login");
    }
    
    // If authenticated but has potential ID issue
    if (isAuthenticated && user && token) {
      if (!user._id && !user.id) {
        console.error("User object missing ID properties:", user);
        setShowDiagnostic(true);
      }
    }
  }, [isAuthenticated, user, token, isLoading, navigate]);
  
  // Show loading while auth state is being checked
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader size="large" />
      </div>
    );
  }
  
  // Authentication diagnostic screen
  if (showDiagnostic) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="alert alert-warning">
                <h4>Authentication Diagnostic</h4>
                <p>There appears to be an issue with your user account data.</p>
                
                <h6>User Object:</h6>
                <pre style={{ fontSize: '12px' }}>{JSON.stringify(user, null, 2)}</pre>
                
                <div className="d-flex mt-3">
                  <button 
                    className="btn btn-primary me-2" 
                    onClick={fixAuthState}
                  >
                    Attempt Fix
                  </button>
                  <button 
                    className="btn btn-outline-secondary me-2" 
                    onClick={() => setShowDiagnostic(false)}
                  >
                    Continue Anyway
                  </button>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    Clear Storage & Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Don't render the component if not authenticated or missing user/token
  if (!isAuthenticated || !user || !token) {
    return null;
  }
  
  const metadata = {
    title: "Freeio - Manage Jobs",
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardLayout>
        <ManageJobs />
      </DashboardLayout>
    </>
  );
}
