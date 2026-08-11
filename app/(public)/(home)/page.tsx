import BrandsSection from "@/features/landing/components/BrandsSection"
import FeaturedItemsSection from "@/features/landing/components/FeaturedItemsSection"
import HomeHeroSection from "@/features/landing/components/HomeHeroSection"
import HowItWorksSection from "@/features/landing/components/HowItWorksSection"
import LandingCtaSection from "@/features/landing/components/LandingCtaSection"
import { connection } from "next/server"

export default async function Page() {
    await connection()

    return (
        <>
            <HomeHeroSection />
            <BrandsSection />
            <FeaturedItemsSection />
            <HowItWorksSection />
            <LandingCtaSection />
        </>
    )
}
