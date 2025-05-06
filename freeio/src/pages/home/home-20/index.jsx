import Header21 from "@/components/header/Header21";
import Hero20 from "@/components/hero/Hero20";
import BrowserCategory20 from "@/components/section/BrowserCategory20";
import CtaBanner18 from "@/components/section/CtaBanner18";
import CtaBanner21 from "@/components/section/CtaBanner21";
import InspireingWork20 from "@/components/section/InspireingWork20";
import InspiringService11 from "@/components/section/InspiringService11";
import NeedSomething2 from "@/components/section/NeedSomething2";
import OurPartners20 from "@/components/section/OurPartners20";
import Testimonial2 from "@/components/section/Testimonial2";
import TrendingService14 from "@/components/section/TrendingService14";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 20",
};

export default function HomePage20() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header21 />
      <div className="body_content">
        <Hero20 />
        <OurPartners20 />
        <TrendingService14 />
        <BrowserCategory20 />
        <NeedSomething2 />
        <CtaBanner18 />
        <Testimonial2 />
        <InspireingWork20 />
        <InspiringService11 />
        <CtaBanner21 />
      </div>
    </>
  );
}
