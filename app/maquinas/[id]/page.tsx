import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MachineDetails } from "@/components/machines/machine-details"

interface MachinePageProps {
  params: {
    id: string
  }
}

export default function MachinePage({ params }: MachinePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MachineDetails machineId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
