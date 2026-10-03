import { cn } from "@/lib/utils";

/**
 * Marca do MaqExpress: um "chevron" de sinalização de obra como símbolo,
 * acompanhado do wordmark. O símbolo evoca movimento/entrega ("express").
 */
export function MaqExpressLogo({ className }: { className?: string }) {
	return (
		<span className={cn("flex items-center gap-2", className)}>
			<span
				aria-hidden
				className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<svg
					viewBox="0 0 24 24"
					className="size-5"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M4 13l5 5 5-11 2 6h4" />
				</svg>
			</span>
			<span className="text-lg font-extrabold tracking-tight text-foreground">
				Maq<span className="text-primary">Express</span>
			</span>
		</span>
	);
}
