import Header13 from "@/components/header/Header13";
import Hero12 from "@/components/hero/Hero12";
import BrowserCategory12 from "@/components/section/BrowserCategory12";
import CtaBanner12 from "@/components/section/CtaBanner12";
import ForClient from "@/components/section/ForClient";
import HighestRated12 from "@/components/section/HighestRated12";
import OurBlog12 from "@/components/section/OurBlogs12";
import OurCta12 from "@/components/section/OurCta12";
import Testimonials12 from "@/components/section/Testimonials12";
import TrendingService2 from "@/components/section/TrendingService2";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 12",
};

export default function HomePage12() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header13 />
      <div className="body_content">
        <Hero12 />
        <BrowserCategory12 />
        <CtaBanner12 />
        <TrendingService2 bgColor={"bgc-gray-3"} />
        <ForClient />
        <HighestRated12 />
        <Testimonials12 />
        <OurBlog12 />
        <OurCta12 />
      </div>
    </>
  );
}
