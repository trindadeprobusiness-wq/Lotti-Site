import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { ProblemSolution } from "@/components/site/ProblemSolution";
import { Features } from "@/components/site/Features";
import { Differentiators } from "@/components/site/Differentiators";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Trust } from "@/components/site/Trust";
import { PricingHero } from "@/components/site/pricing/PricingHero";
import { PricingCards } from "@/components/site/pricing/PricingCards";
import { PricingFAQ } from "@/components/site/pricing/PricingFAQ";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { StructuredData } from "@/components/site/StructuredData";

export default function Page() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <Differentiators />
        <HowItWorks />
        <Trust />
        <div id="planos">
          <PricingHero />
          <PricingCards />
          <PricingFAQ />
        </div>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
