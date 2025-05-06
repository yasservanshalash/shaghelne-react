import Header17 from "@/components/header/Header17";
import Hero16 from "@/components/hero/Hero16";
import Blog16 from "@/components/section/Blog16";
import BrowserCategory16 from "@/components/section/BrowserCategory16";
import CtaBanner16 from "@/components/section/CtaBanner16";
import LearnFreeio16 from "@/components/section/LearnFreeio16";
import LearnFreeio17 from "@/components/section/LearnFreeio17";
import NeedSomething2 from "@/components/section/NeedSomething2";
import OurCta16 from "@/components/section/OurCta16";
import OurPartner1 from "@/components/section/OurPartner1";
import PopularService1 from "@/components/section/PopularService1";
import React from "react";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 16",
};

export default function HomePage16() {
  return (
    <div>
      <MetaComponent meta={metadata} />
      <Header17 />
      <div className="body_content">
        <Hero16 />
        <BrowserCategory16 />
        <NeedSomething2 />
        <PopularService1 />
        <LearnFreeio16 />
        <CtaBanner16 />
        <OurPartner1 />
        <LearnFreeio17 />
        <Blog16 />
        <OurCta16 />
      </div>
    </div>
  );
}
