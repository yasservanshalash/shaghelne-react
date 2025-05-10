import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateJobInfo from "@/components/dashboard/section/CreateJobInfo";
import MobileNavigation2 from "@/components/header/MobileNavigation2";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Create Job",
};

export default function CreateJobPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <CreateJobInfo />
      </DashboardLayout>
    </>
  );
} 