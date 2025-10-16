"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface FilterState {
  selectedCategories: string[]
  selectedLocations: string[]
  priceRange: [number, number]
  searchTerm: string
}

interface MachinesFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const categories = [
  { id: "escavadeiras", label: "Escavadeiras", count: 12 },
  { id: "tratores", label: "Tratores", count: 8 },
  { id: "caminhoes", label: "Caminhões", count: 15 },
  { id: "betoneiras", label: "Betoneiras", count: 6 },
  { id: "compressores", label: "Compressores", count: 9 },
  { id: "geradores", label: "Geradores", count: 7 },
  { id: "ferramentas", label: "Ferramentas", count: 23 },
  { id: "motoniveladoras", label: "Motoniveladoras", count: 4 },
]

const locations = [
  { id: "minha-cidade", label: "Minha Cidade", count: 12 }, // Adicionado "Minha Cidade" como primeira opção
  { id: "sp", label: "São Paulo", count: 45 },
  { id: "rj", label: "Rio de Janeiro", count: 32 },
  { id: "mg", label: "Minas Gerais", count: 28 },
  { id: "pr", label: "Paraná", count: 18 },
  { id: "sc", label: "Santa Catarina", count: 15 },
]

export function MachinesFilters({ filters, onFiltersChange }: MachinesFiltersProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.selectedCategories, categoryId]
      : filters.selectedCategories.filter((id) => id !== categoryId)

    onFiltersChange({
      ...filters,
      selectedCategories: newCategories,
    })
  }

  const handleLocationChange = (locationId: string, checked: boolean) => {
    const newLocations = checked
      ? [...filters.selectedLocations, locationId]
      : filters.selectedLocations.filter((id) => id !== locationId)

    onFiltersChange({
      ...filters,
      selectedLocations: newLocations,
    })
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [newRange[0], newRange[1]],
    })
  }

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      searchTerm,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      selectedCategories: [],
      selectedLocations: [],
      priceRange: [0, 50000],
      searchTerm: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Buscar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nome do equipamento..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Categorias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={category.id} className="flex-1 text-sm">
                {category.label}
              </Label>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={50000}
            min={0}
            step={500}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {filters.priceRange[0].toLocaleString()}</span>
            <span>R$ {filters.priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Localização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox
                id={location.id}
                checked={filters.selectedLocations.includes(location.id)}
                onCheckedChange={(checked) => handleLocationChange(location.id, checked as boolean)}
              />
              <Label htmlFor={location.id} className="flex-1 text-sm">
                {location.label}
              </Label>
              <span className="text-xs text-muted-foreground">({location.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Limpar Filtros
      </Button>
    </div>
  )
}
