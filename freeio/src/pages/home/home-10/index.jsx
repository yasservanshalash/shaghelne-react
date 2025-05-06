import Hero10 from "@/components/hero/Hero10";
import BrowserCategory4 from "@/components/section/BrowserCategory4";
import CtaBanner10 from "@/components/section/CtaBanner10";
import CtaBanner9 from "@/components/section/CtaBanner9";
import HighestRated2 from "@/components/section/HighestRated2";
import LatestJob3 from "@/components/section/LatestJob3";
import OurCta1 from "@/components/section/OurCta1";
import OurPartner1 from "@/components/section/OurPartner1";
import PriceTable1 from "@/components/section/PriceTable1";
import Testimonial1 from "@/components/section/Testimonial1";
import TrendingService2 from "@/components/section/TrendingService2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 10",
};

export default function HomePage10() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Hero10 />
      <TrendingService2 />
      <BrowserCategory4 />
      <LatestJob3 />
      <HighestRated2 />
      <CtaBanner9 />
      <Testimonial1 />
      <CtaBanner10 />
      <PriceTable1 />
      <OurCta1 />
      <OurPartner1 />
    </>
  );
}
