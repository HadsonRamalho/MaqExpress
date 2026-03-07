"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Wrench } from "lucide-react"
import Link from "next/link"
import { Maquina } from "@/interfaces"

interface FilterState {
  searchTerm: string
  priceRange: [number, number]
}

export function MachinesList({ machines, filters }: { machines: Maquina[], filters: FilterState }) {

  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      const matchSearch = m.nome.toLowerCase().includes(filters.searchTerm.toLowerCase())
      return matchSearch && m.ativo
    })
  }, [machines, filters])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredMachines.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum equipamento disponível no momento</div>
      ) : (
        filteredMachines.map((machine) => (
          <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <Wrench className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg leading-tight">{machine.nome}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{machine.descricao}</p>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline">Série: {machine.numero_serie}</Badge>
                  <Link href={`/maquinas/${machine.id}`}>
                    <Button size="sm">Ver Detalhes</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
