import { MachineForm } from "@/components/dashboard/machine-form";

export default function CadastrarMaquinaPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">Anunciar máquina</h1>
			<p className="mt-1 text-muted-foreground">
				Preencha os dados abaixo. Você pode editar tudo depois.
			</p>
			<div className="mt-8">
				<MachineForm />
			</div>
		</div>
	);
}
