import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb9 from "@/components/breadcumb/Breadcumb9";
import ProjectListing from "@/components/section/ProjectListing";

import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Projects",
};

export default function ProjectPage1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Projects"]} />
      <Breadcumb9 />
      <ProjectListing />
    </>
  );
}
