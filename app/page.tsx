import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EquipmentCarousel } from "@/components/equipment-carousel"
import { FeaturedEquipment } from "@/components/featured-equipment"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <EquipmentCarousel />
        <FeaturedEquipment />
      </main>
      <Footer />
    </div>
  )
}
