"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MachinesList } from "@/components/machines/machines-list"
import { MachinesFilters } from "@/components/machines/machines-filters"

export interface FilterState {
  selectedCategories: string[]
  selectedLocations: string[]
  priceRange: [number, number]
  searchTerm: string
}

export default function MachinesPage() {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedLocations: [],
    priceRange: [0, 50000],
    searchTerm: "",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-balance mb-2">Máquinas e Equipamentos</h1>
            <p className="text-muted-foreground">Encontre o equipamento ideal para sua obra</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <MachinesFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            {/* Machines List */}
            <div className="flex-1">
              <MachinesList machines={[]} filters={filters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
