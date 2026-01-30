"use client";

import { Loader2 } from "lucide-react";
import type { Control } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getPakets } from "@/lib/actions/paket";
import { useServerList } from "@/lib/hooks/use-server-query";

interface PaketSelectProps {
	control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	name: string;
	label?: string;
	description?: string;
	placeholder?: string;
}

export function PaketSelect({
	control,
	name,
	label = "Paket WiFi",
	description = "Pilih paket WiFi langganan",
	placeholder = "Pilih paket",
}: PaketSelectProps) {
	const { data, isLoading } = useServerList({
		queryKey: ["pakets-select"],
		queryFn: () => getPakets({ size: 100 }), // Get all packages (limit 100)
	});

	const pakets = data?.content || [];

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="text-white">{label}</FormLabel>
					<Select
						onValueChange={field.onChange}
						defaultValue={field.value}
						disabled={isLoading}
					>
						<FormControl>
							<SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent className="bg-slate-800 border-slate-700 text-white">
							{isLoading ? (
								<div className="flex items-center justify-center p-2 text-slate-400">
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									<span>Memuat data...</span>
								</div>
							) : (
								pakets.map((paket) => (
									<SelectItem key={paket.id} value={paket.id}>
										{paket.nama} -{" "}
										{new Intl.NumberFormat("id-ID", {
											style: "currency",
											currency: "IDR",
											minimumFractionDigits: 0,
										}).format(paket.harga)}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
					{description && (
						<FormDescription className="text-slate-400">
							{description}
						</FormDescription>
					)}
					<FormMessage className="text-red-400" />
				</FormItem>
			)}
		/>
	);
}
