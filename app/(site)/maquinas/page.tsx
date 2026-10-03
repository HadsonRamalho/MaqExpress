import { Suspense } from "react";
import { MaquinasListagem } from "@/components/marketplace/maquinas-listagem";

export default function MaquinasPage() {
	return (
		<Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" />}>
			<MaquinasListagem />
		</Suspense>
	);
}
