import { notFound } from "next/navigation";
import { MachineForm } from "@/components/dashboard/machine-form";
import { getMaquina } from "@/lib/mock-data";

export default async function EditarMaquinaPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const maquina = getMaquina(id);
	if (!maquina) notFound();

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">Editar máquina</h1>
			<p className="mt-1 text-muted-foreground">{maquina.nome}</p>
			<div className="mt-8">
				<MachineForm maquina={maquina} />
			</div>
		</div>
	);
}
