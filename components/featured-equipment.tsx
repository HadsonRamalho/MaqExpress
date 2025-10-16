"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const featuredEquipment = [
  {
    name: "Roçadeira",
    price: "R$10092",
    image: "/brush-cutter-garden-equipment.png",
  },
  {
    name: "Escavadeira",
    price: "R$12292",
    image: "/yellow-excavator-construction-site.png",
  },
  {
    name: "Motoniveladora",
    price: "R$2540",
    image: "/motor-grader-construction-equipment.png",
  },
  {
    name: "Retroescavadeira",
    price: "R$8500",
    image: "/backhoe-loader.png",
  },
]

export function FeaturedEquipment() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEquipment.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredEquipment.length) % featuredEquipment.length)
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-balance">Destaques Da Semana</h2>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={prevSlide} className="shrink-0 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-4xl">
              {[0, 1, 2].map((offset) => {
                const index = (currentIndex + offset) % featuredEquipment.length
                const equipment = featuredEquipment[index]
                return (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] relative">
                        <img
                          src={equipment.image || "/placeholder.svg"}
                          alt={equipment.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-lg mb-2">{equipment.name}</h3>
                        <p className="text-primary font-bold text-xl">{equipment.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} className="shrink-0 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
