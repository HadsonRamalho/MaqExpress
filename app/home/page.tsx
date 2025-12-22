"use client"

import "@/components/home/home.css";
import {
  Forklift,
  Handshake,
  Headset,
  MousePointerClickIcon,

} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import teste from "@/assets/placeholder.jpg";
import escavadeira1 from "@/assets/placeholder.jpg";
import escavadeira from "@/assets/placeholder.jpg";
import cacamba from "@/assets/placeholder.jpg";
import motoniveladora from "@/assets/placeholder.jpg";
import moto_serra from "@/assets/placeholder.jpg";
import trator from "@/assets/placeholder.jpg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SearchFilter from "@/components/searchs";
import { useRouter } from "next/navigation";


function Home() {
  const router = useRouter();
  return (
        <main className="home-container">
          <section className="titulo-section">
            <h1>Locação de Máquinas e Equipamentos</h1>
            <p>
              Encontre a máquina ideal para sua obra ou disponibilize seus
              equipamentos para locação com segurança e sem burocracia.
            </p>
            <SearchFilter/>
          </section>

          <section className="beneficio-section">
            <h1>Por Que Alugar Na MAQEXPRESS?</h1>
            <div className="beneficios">
              <Card className="card">
                <Forklift size={40} color="#29a366" />
                <CardTitle> Variedade</CardTitle>
                <CardContent className="card-content">
                  Máquinas de diferentes categorias para atender sua
                  necessidade, sempre disponíveis e prontas para uso.
                </CardContent>
              </Card>
              <Card className="card">
                <MousePointerClickIcon size={40} color="#29a366" />
                <CardTitle> Facilidade</CardTitle>
                <CardContent className="card-content">
                  Processo 100% online, sem burocracia! Alugue em poucos cliques
                  e receba onde precisar.
                </CardContent>
              </Card>
              <Card className="card">
                <Handshake size={40} color="#29a366" />
                <CardTitle>Segurança</CardTitle>
                <CardContent className="card-content">
                  Garantimos que todos os usuários são verificados para evitar
                  fraudes e proporcionar negociações seguras. Utilizamos
                  contratos eletrônicos e criptografia para sua proteção.
                </CardContent>
              </Card>
              <Card className="card">
                <Headset size={40} color="#29a366" />
                <CardTitle> Suporte Agilizado</CardTitle>
                <CardContent className="card-content">
                  Nossa equipe está sempre pronta para ajudar, garantindo uma
                  experiência ágil e sem complicações.
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="teste">
            <h1>Encontre O Equipamento Ideal Para Sua Obra</h1>
            <Carousel>
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel">
                  <img
                    className="hover:cursor-pointer"
                    src={cacamba.src}
                    alt="caçamba"
                    onClick={() => router.push(`/maquinas/${encodeURIComponent('caçamba')}`)}
                  />
                  <CardTitle>Caçamba</CardTitle>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel">
                  <img
                    className="hover:cursor-pointer"
                    src={moto_serra.src}
                    alt="motosserra"
                    onClick={() => router.push(`/maquinas/${encodeURIComponent('motosserra')}`)}
                  />
                  <CardTitle>Motosserra</CardTitle>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel">
                  <img
                    className="hover:cursor-pointer"
                    src={escavadeira1.src}
                    alt="escavadeira"
                    onClick={() => router.push(`/maquinas/${encodeURIComponent('escavadeira')}`)}
                  />
                  <CardTitle>Escavadeira</CardTitle>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel">
                  <img
                    className="hover:cursor-pointer"
                    src={trator.src}
                    alt="trator"
                    onClick={() => router.push(`/maquinas/${encodeURIComponent('trator')}`)}
                  />
                  <CardTitle>Trator</CardTitle>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>

          <section className="destaque-section">
            <div>
              <h1>Destaques Da Semana</h1>
              <Carousel>
                <CarouselContent>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel-item">
                    <img
                      className="hover:cursor-pointer"
                      src={teste.src}
                      alt=""
                      onClick={() => router.push(`/maquinas/${encodeURIComponent('Roçadeira')}`)}
                    />
                    <CardTitle>Roçadeira</CardTitle>
                    <CardContent>R$10092</CardContent>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel-item">
                    <img
                      className="hover:cursor-pointer"
                      src={escavadeira.src}
                      alt=""
                      onClick={() => router.push(`/maquinas/${encodeURIComponent('Escavadeira')}`)}
                    />
                    <CardTitle>Escavadeira</CardTitle>
                    <CardContent>R$12292</CardContent>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel-item">
                    <img
                      className="hover:cursor-pointer"
                      src={motoniveladora.src}
                      alt=""
                      onClick={() => router.push(`/maquinas/${encodeURIComponent('Motoniveladora')}`)}
                    />
                    <CardTitle>Motoniveladora</CardTitle>
                    <CardContent>R$2540</CardContent>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel-item">
                    <img
                      className="hover:cursor-pointer"
                      src={escavadeira.src}
                      alt=""
                      onClick={() => router.push(`/maquinas/${encodeURIComponent('escavadeira')}`)}
                    />
                    <CardTitle>Escavadeira</CardTitle>
                    <CardContent>R$5410</CardContent>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3 carousel-item">
                    <img
                      className="hover:cursor-pointer"
                      src={motoniveladora.src}
                      alt=""
                      onClick={() => router.push(`/maquinas/${encodeURIComponent('motoniveladora')}`)}
                    />
                    <CardTitle>Motoniveladora</CardTitle>
                    <CardContent>R$10000</CardContent>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>
        </main>
  );
}

export default Home;
