"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Eye, MoreHorizontal, Search, MapPin, Star, Wrench } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data for user's machines
const userMachines = [
  {
    id: "1",
    name: "Escavadeira Caterpillar 320D",
    category: "Escavadeiras",
    price: 12500,
    priceUnit: "mês",
    location: "São Paulo, SP",
    status: "active",
    image: "/yellow-excavator-construction-site.png",
    views: 45,
    rentals: 8,
    rating: 4.8,
    lastRented: "2024-01-15",
  },
  {
    id: "2",
    name: "Motoniveladora Caterpillar 140M",
    category: "Motoniveladoras",
    price: 8500,
    priceUnit: "mês",
    location: "São Paulo, SP",
    status: "rented",
    image: "/motor-grader-construction-equipment.png",
    views: 32,
    rentals: 5,
    rating: 4.6,
    lastRented: "2024-01-20",
  },
  {
    id: "3",
    name: "Compressor de Ar 10HP",
    category: "Compressores",
    price: 180,
    priceUnit: "dia",
    location: "São Paulo, SP",
    status: "maintenance",
    image: "/air-compressor-industrial-equipment.png",
    views: 18,
    rentals: 12,
    rating: 4.4,
    lastRented: "2024-01-10",
  },
  {
    id: "4",
    name: "Betoneira 400L Profissional",
    category: "Betoneiras",
    price: 280,
    priceUnit: "dia",
    location: "São Paulo, SP",
    status: "active",
    image: "/concrete-mixer-construction-equipment.png",
    views: 28,
    rentals: 15,
    rating: 4.5,
    lastRented: "2024-01-18",
  },
]

export function MyMachinesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredMachines = userMachines.filter((machine) => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativa</Badge>
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Alugada</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Manutenção</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativa</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar suas máquinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativa</SelectItem>
            <SelectItem value="rented">Alugada</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="inactive">Inativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{filteredMachines.length} máquinas encontradas</h2>
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMachines.map((machine) => (
          <Card key={machine.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={machine.image || "/placeholder.svg"}
                  alt={machine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">{getStatusBadge(machine.status)}</div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {machine.category}
                  </Badge>
                  <h3 className="font-semibold text-lg leading-tight">{machine.name}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{machine.location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{machine.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{machine.views} visualizações</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xl font-bold text-primary">R$ {machine.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">por {machine.priceUnit}</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/maquinas/${machine.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/editar-maquina/${machine.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-xs text-muted-foreground pt-1">
                  {machine.rentals} locações • Última: {new Date(machine.lastRented).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma máquina encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros ou adicione uma nova máquina.</p>
        </div>
      )}
    </div>
  )
}
