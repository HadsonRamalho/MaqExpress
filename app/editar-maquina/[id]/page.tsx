"use client"

import { useParams } from "next/navigation"
import { AddMachineForm } from "@/components/machines/add-machine-form"
import { useAuth } from "@/hooks/use-auth"
import { redirect } from "next/navigation"

// Mock data - em produção, buscar da API
const getMachineData = (id: string) => {
  return {
    id,
    name: "Escavadeira Caterpillar 320D",
    category: "Escavadeiras",
    description: "Escavadeira em excelente estado de conservação, ideal para obras de médio e grande porte.",
    price: 12500,
    priceUnit: "mês",
    city: "São Paulo",
    state: "SP",
    specifications: "Peso: 20.5t, Potência: 164hp, Capacidade da caçamba: 1.2m³",
    features: ["GPS", "Ar Condicionado", "Revisada"],
    condition: "seminovo",
    year: 2020,
    brand: "Caterpillar",
    model: "320D",
    isAvailable: true,
    requiresOperator: false,
    deliveryAvailable: true,
    minRentalDays: 1,
    maxRentalDays: 30,
    allowedPeriods: {
      hours: false,
      days: true,
      weeks: true,
      months: true,
    },
    periodLimits: {
      hours: { min: "4", max: "24" },
      days: { min: "1", max: "30" },
      weeks: { min: "1", max: "12" },
      months: { min: "1", max: "6" },
    },
    periodPrices: {
      hours: "",
      days: "500",
      weeks: "3200",
      months: "12500",
    },
    images: ["/yellow-excavator-construction-site.png"],
  }
}

export default function EditMachinePage() {
  const { user } = useAuth()
  const params = useParams()
  const machineId = params.id as string

  if (!user) {
    redirect("/login")
  }

  const machineData = getMachineData(machineId)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Editar Máquina</h1>
          <p className="text-muted-foreground mt-2">Atualize as informações da sua máquina</p>
        </div>

        <AddMachineForm machineData={machineData} isEditing={true} />
      </div>
    </div>
  )
}
