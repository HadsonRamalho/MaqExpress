// Dados de demonstração para montar os fluxos de frontend antes do backend.
// Substituir por chamadas a `services/maquina.ts` quando a listagem real existir.

import {
	Axe,
	Construction,
	Droplets,
	Fan,
	Scissors,
	Truck,
	Wind,
	type LucideIcon,
} from "lucide-react";

export interface Categoria {
	slug: string;
	nome: string;
	icon: LucideIcon;
}

export const categorias: Categoria[] = [
	{ slug: "escavadeiras", nome: "Escavadeiras", icon: Construction },
	{ slug: "retroescavadeiras", nome: "Retroescavadeiras", icon: Construction },
	{ slug: "caminhoes", nome: "Caminhões", icon: Truck },
	{ slug: "motoniveladoras", nome: "Motoniveladoras", icon: Fan },
	{ slug: "betoneiras", nome: "Betoneiras", icon: Droplets },
	{ slug: "compressores", nome: "Compressores", icon: Wind },
	{ slug: "cortadores", nome: "Cortadores e roçadeiras", icon: Scissors },
	{ slug: "ferramentas", nome: "Ferramentas", icon: Axe },
];

export interface MaquinaMock {
	id: string;
	nome: string;
	categoriaSlug: string;
	categoriaNome: string;
	descricao: string;
	precoDia: number;
	precoSemana?: number;
	cidade: string;
	uf: string;
	nota: number;
	avaliacoes: number;
	imagem: string;
	locador: string;
	disponivel: boolean;
}

export const maquinas: MaquinaMock[] = [
	{
		id: "esc-cat-320",
		nome: "Escavadeira hidráulica CAT 320",
		categoriaSlug: "escavadeiras",
		categoriaNome: "Escavadeiras",
		descricao: "20 t, esteira, ideal para terraplanagem e fundações.",
		precoDia: 1250,
		precoSemana: 7200,
		cidade: "Campo Grande",
		uf: "MS",
		nota: 4.9,
		avaliacoes: 38,
		imagem: "/excavator-construction.png",
		locador: "Terra Forte Locações",
		disponivel: true,
	},
	{
		id: "retro-jcb-3cx",
		nome: "Retroescavadeira JCB 3CX",
		categoriaSlug: "retroescavadeiras",
		categoriaNome: "Retroescavadeiras",
		descricao: "Versátil para valas, carregamento e nivelamento.",
		precoDia: 780,
		precoSemana: 4500,
		cidade: "Dourados",
		uf: "MS",
		nota: 4.7,
		avaliacoes: 22,
		imagem: "/backhoe-loader.png",
		locador: "Construmaq",
		disponivel: true,
	},
	{
		id: "cam-basc-6x4",
		nome: "Caminhão basculante 6x4",
		categoriaSlug: "caminhoes",
		categoriaNome: "Caminhões",
		descricao: "Caçamba 12 m³, transporte de agregados e entulho.",
		precoDia: 640,
		cidade: "Três Lagoas",
		uf: "MS",
		nota: 4.6,
		avaliacoes: 15,
		imagem: "/dump-truck-construction.png",
		locador: "Rodriguez Transportes",
		disponivel: false,
	},
	{
		id: "moto-120k",
		nome: "Motoniveladora 120K",
		categoriaSlug: "motoniveladoras",
		categoriaNome: "Motoniveladoras",
		descricao: "Acabamento de pistas, estradas vicinais e pátios.",
		precoDia: 1490,
		precoSemana: 8900,
		cidade: "Campo Grande",
		uf: "MS",
		nota: 5.0,
		avaliacoes: 9,
		imagem: "/motor-grader-construction-equipment.png",
		locador: "Terra Forte Locações",
		disponivel: true,
	},
	{
		id: "bet-400l",
		nome: "Betoneira 400 L",
		categoriaSlug: "betoneiras",
		categoriaNome: "Betoneiras",
		descricao: "Motor elétrico, para concreto e argamassa na obra.",
		precoDia: 95,
		precoSemana: 480,
		cidade: "Dourados",
		uf: "MS",
		nota: 4.5,
		avaliacoes: 54,
		imagem: "/concrete-mixer-construction-equipment.png",
		locador: "Aluga Fácil",
		disponivel: true,
	},
	{
		id: "comp-ar-375",
		nome: "Compressor de ar 375 pcm",
		categoriaSlug: "compressores",
		categoriaNome: "Compressores",
		descricao: "Para rompedores pneumáticos e jateamento.",
		precoDia: 320,
		cidade: "Campo Grande",
		uf: "MS",
		nota: 4.4,
		avaliacoes: 11,
		imagem: "/air-compressor-industrial-equipment.png",
		locador: "Construmaq",
		disponivel: true,
	},
	{
		id: "rocadeira-pro",
		nome: "Roçadeira profissional",
		categoriaSlug: "cortadores",
		categoriaNome: "Cortadores e roçadeiras",
		descricao: "Limpeza de terrenos e manutenção de áreas verdes.",
		precoDia: 70,
		precoSemana: 350,
		cidade: "Naviraí",
		uf: "MS",
		nota: 4.8,
		avaliacoes: 27,
		imagem: "/brush-cutter-garden-equipment.png",
		locador: "Verde Vivo",
		disponivel: true,
	},
	{
		id: "motosserra-62cc",
		nome: "Motosserra 62 cc",
		categoriaSlug: "ferramentas",
		categoriaNome: "Ferramentas",
		descricao: "Sabre de 20\", corte de médio porte.",
		precoDia: 60,
		cidade: "Dourados",
		uf: "MS",
		nota: 4.7,
		avaliacoes: 40,
		imagem: "/chainsaw-power-tool.png",
		locador: "Aluga Fácil",
		disponivel: true,
	},
];

export function formatarBRL(valor: number): string {
	return valor.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		maximumFractionDigits: 0,
	});
}
