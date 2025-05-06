import Hero2 from "@/components/hero/Hero2";
import BrowserCategory2 from "@/components/section/BrowserCategory2";
import CtaBanner2 from "@/components/section/CtaBanner2";
import HighestRated1 from "@/components/section/HighestRated1";
import LearnFreeio1 from "@/components/section/LearnFreeio1";
import NeedSomething2 from "@/components/section/NeedSomething2";
import OurPartner1 from "@/components/section/OurPartner1";
import PopularService1 from "@/components/section/PopularService1";
import PriceTable1 from "@/components/section/PriceTable1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 2",
};

export default function HomePage2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Hero2 />
      <NeedSomething2 />
      <PopularService1 />
      <CtaBanner2 />
      <OurPartner1 />
      <BrowserCategory2 />
      <HighestRated1 />
      <LearnFreeio1 />
      <PriceTable1 />
    </>
  );
}
