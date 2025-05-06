import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import JobListing from "@/components/section/JobListing";
import MetaComponent from "@/components/common/MetaComponent";

export default function JobPage() {
  const metadata = {
    title: "Freeio - Find Jobs",
    description: "Browse and find the best job opportunities",
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Jobs"]} />
      <JobListing />
    </>
  );
} 