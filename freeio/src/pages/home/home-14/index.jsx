import CategoryList14 from "@/components/header/CategoryList14";
import Header15 from "@/components/header/Header15";
import Hero14 from "@/components/hero/Hero14";
import About14 from "@/components/section/About14";
import BrowserCategory14 from "@/components/section/BrowserCategory14";
import CtaBanner14 from "@/components/section/CtaBanner14";
import CtaBanner142 from "@/components/section/CtaBanner142";
import HighestRated14 from "@/components/section/HighestRated14";
import LearnFreeio1 from "@/components/section/LearnFreeio1";
import OurPartner1 from "@/components/section/OurPartner1";
import SkillArea1 from "@/components/section/SkillArea1";
import TrendingService14 from "@/components/section/TrendingService14";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 14",
};

export default function HomePage14() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header15 />
      <div className="body_content">
        <CategoryList14 />
        <Hero14 />
        <OurPartner1 />
        <BrowserCategory14 />
        <CtaBanner14 />
        <TrendingService14 />
        <CtaBanner142 />
        <HighestRated14 />
        <About14 />
        <LearnFreeio1 />
        <SkillArea1 />
      </div>
    </>
  );
}
