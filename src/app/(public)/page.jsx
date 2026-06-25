import FeaturedClassesSection from "@/components/home/FeaturedClassesSection";
import Hero from "@/components/home/Hero";
import IntelligentPerformanceSection from "@/components/home/IntelligentPerformanceSection";
import LatestForumPostsSection from "@/components/home/LatestForumPostsSection";
import PerformanceMetricsBar from "@/components/home/PerformanceMetricsBar";
import Footer from "@/components/shared/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <PerformanceMetricsBar />
      <FeaturedClassesSection />
      <IntelligentPerformanceSection />
      <LatestForumPostsSection />
      <Footer />
    </div>
  );
}
