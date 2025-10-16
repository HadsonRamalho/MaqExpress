"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface FilterState {
  selectedCategories: string[]
  selectedLocations: string[]
  priceRange: [number, number]
  searchTerm: string
}

interface MachinesListProps {
  filters: FilterState
}

// Mock data for machines
const machines = [
  {
    id: "1",
    name: "Escavadeira Caterpillar 320D",
    category: "escavadeiras",
    price: 12500,
    priceUnit: "mês",
    location: "São Paulo, SP",
    locationId: "sp",
    rating: 4.8,
    reviews: 24,
    image: "/yellow-excavator-construction-site.png",
    available: true,
    owner: "João Construções",
    features: ["GPS", "Ar Condicionado", "Revisada"],
  },
  {
    id: "2",
    name: "Motoniveladora Caterpillar 140M",
    category: "motoniveladoras",
    price: 8500,
    priceUnit: "mês",
    location: "Rio de Janeiro, RJ",
    locationId: "rj",
    rating: 4.6,
    reviews: 18,
    image: "/motor-grader-construction-equipment.png",
    available: true,
    owner: "RJ Equipamentos",
    features: ["Automática", "Baixa Quilometragem"],
  },
  {
    id: "3",
    name: "Roçadeira Profissional Stihl",
    category: "ferramentas",
    price: 150,
    priceUnit: "dia",
    location: "Belo Horizonte, MG",
    locationId: "mg",
    rating: 4.9,
    reviews: 42,
    image: "/brush-cutter-garden-equipment.png",
    available: true,
    owner: "MG Jardinagem",
    features: ["2 Tempos", "Baixo Consumo"],
  },
  {
    id: "4",
    name: "Caçamba Basculante 15m³",
    category: "caminhoes",
    price: 5500,
    priceUnit: "mês",
    location: "Curitiba, PR",
    locationId: "pr",
    rating: 4.7,
    reviews: 31,
    image: "/dump-truck-construction.png",
    available: false,
    owner: "PR Transportes",
    features: ["15m³", "Hidráulica", "Documentação OK"],
  },
  {
    id: "5",
    name: "Betoneira 400L Profissional",
    category: "betoneiras",
    price: 280,
    priceUnit: "dia",
    location: "Florianópolis, SC",
    locationId: "sc",
    rating: 4.5,
    reviews: 15,
    image: "/concrete-mixer-construction-equipment.png",
    available: true,
    owner: "SC Construções",
    features: ["400L", "Motor Diesel", "Rodas"],
  },
  {
    id: "6",
    name: "Compressor de Ar 10HP",
    category: "compressores",
    price: 180,
    priceUnit: "dia",
    location: "São Paulo, SP",
    locationId: "sp",
    rating: 4.4,
    reviews: 28,
    image: "/air-compressor-industrial-equipment.png",
    available: true,
    owner: "SP Ferramentas",
    features: ["10HP", "Portátil", "Baixo Ruído"],
  },
]

export function MachinesList({ filters }: MachinesListProps) {
  const [sortBy, setSortBy] = useState("relevance")
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      // Filter by search term
      if (filters.searchTerm && !machine.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Filter by categories
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(machine.category)) {
        return false
      }

      // Filter by locations
      if (filters.selectedLocations.length > 0 && !filters.selectedLocations.includes(machine.locationId)) {
        return false
      }

      // Filter by price range
      if (machine.price < filters.priceRange[0] || machine.price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters])

  const toggleFavorite = (machineId: string) => {
    if (favorites.includes(machineId)) {
      setFavorites(favorites.filter((id) => id !== machineId))
    } else {
      setFavorites([...favorites, machineId])
    }
  }

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{filteredMachines.length} equipamentos encontrados</h2>
          <p className="text-sm text-muted-foreground">Equipamentos disponíveis para locação</p>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price-low">Menor preço</SelectItem>
            <SelectItem value="price-high">Maior preço</SelectItem>
            <SelectItem value="rating">Melhor avaliação</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMachines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhum equipamento encontrado com os filtros selecionados.</p>
          <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros para ver mais resultados.</p>
        </div>
      )}

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedMachines.map((machine) => (
          <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={machine.image || "/placeholder.svg"}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => toggleFavorite(machine.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(machine.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
                {!machine.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black">
                      Indisponível
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <Badge variant="secondary" className="text-xs mb-2 capitalize">
                    {machine.category.replace("-", " ")}
                  </Badge>
                  <h3 className="font-semibold text-lg leading-tight">{machine.name}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{machine.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{machine.rating}</span>
                  <span className="text-muted-foreground">({machine.reviews} avaliações)</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {machine.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-2xl font-bold text-primary">R$ {machine.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">por {machine.priceUnit}</div>
                  </div>
                  <Link href={`/maquinas/${machine.id}`}>
                    <Button disabled={!machine.available} className="shrink-0">
                      {machine.available ? "Ver Detalhes" : "Indisponível"}
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground pt-1">Por: {machine.owner}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredMachines.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Carregar mais equipamentos
          </Button>
        </div>
      )}
    </div>
  )
}
