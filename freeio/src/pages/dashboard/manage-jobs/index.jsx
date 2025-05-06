import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageJobs from "@/components/dashboard/manage/ManageJobs";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function ManageJobsPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
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
