import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PricingHero } from "@/components/site/pricing/PricingHero";
import { PricingCards } from "@/components/site/pricing/PricingCards";
import { PricingComparison } from "@/components/site/pricing/PricingComparison";
import { PricingFAQ } from "@/components/site/pricing/PricingFAQ";

export default function PlanosPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <PricingHero />
        <PricingCards />
        <PricingComparison />
        <PricingFAQ />
      </main>
      <Footer />
    </>
  );
}
