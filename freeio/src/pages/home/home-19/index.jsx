import Header20 from "@/components/header/Header20";
import Hero19 from "@/components/hero/Hero19";
import Blog16 from "@/components/section/Blog16";
import BrowserCategory19 from "@/components/section/BrowserCategory19";
import CounterInfo2 from "@/components/section/CounterInfo2";
import CtaBanner20 from "@/components/section/CtaBanner20";
import NeedSomething5 from "@/components/section/NeedSomething5";
import OurCta16 from "@/components/section/OurCta16";
import OurTeam from "@/components/section/OurTeam";
import Testimonials19 from "@/components/section/Testimonials19";
import TrendingService3 from "@/components/section/TrendingService3";
import TrendingService6 from "@/components/section/TrendingService6";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 19",
};

export default function HomePage19() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header20 />
      <div className="body_content">
        <Hero19 />
        <NeedSomething5 />
        <TrendingService6 />
        <CtaBanner20 />
        <BrowserCategory19 />
        <CounterInfo2 />
        <OurTeam />
        <Testimonials19 />
        <Blog16 />
        <OurCta16 />
      </div>
    </>
  );
}
