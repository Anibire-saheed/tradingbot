import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { OptionAlphaHero } from "@/components/hero/option-alpha-hero";
import { TradingSimplifiedSection } from "@/components/sections/trading-simplified-section";
import { LicensedServicesSection } from "@/components/services/licensed-services-section";
import { RewardsSection } from "@/components/sections/rewards-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { PartnersSection } from "@/components/sections/partners-section";

export default function Home() {
  return (
    <>
      <OptionAlphaHero />
      <TradingSimplifiedSection />
      <LicensedServicesSection />
      <HowItWorksSection />
      <RewardsSection />
      <PartnersSection />
      <FaqSection />
      <ContactSection email={process.env.CONTACT_EMAIL || "support@omnidev.co"} />
      <SiteFooter />
    </>
  );
}
