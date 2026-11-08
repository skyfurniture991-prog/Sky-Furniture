import CategoryBar from "../components/home/CategoryBar";
import CtaBanner from "../components/home/CtaBanner";
import FaqSection from "../components/home/FaqSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FlashSale from "../components/home/FlashSale";
import Hero from "../components/home/Hero";
import ProcessTimeline from "../components/home/ProcessTimeline";
import Testimonials from "../components/home/Testimonials";
import TrustMarquee from "../components/home/TrustMarquee";
import WhyUs from "../components/home/WhyUs";
import RecentlyViewed from "../components/product/RecentlyViewed";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function HomePage() {
  useDocumentTitle("");

  return (
    <main>
      <Hero />
      <TrustMarquee />
      <CategoryBar />
      <FeaturedProducts />
      <FlashSale />
      <ProcessTimeline />
      <WhyUs />
      <Testimonials />
      <div className="container-page">
        <RecentlyViewed className="pb-16" />
      </div>
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
