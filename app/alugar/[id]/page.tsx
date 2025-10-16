import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RentalFlow } from "@/components/rental/rental-flow"

interface RentalPageProps {
  params: {
    id: string
  }
}

export default function RentalPage({ params }: RentalPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RentalFlow machineId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
