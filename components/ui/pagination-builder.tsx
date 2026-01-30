"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	type LucideIcon,
} from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/lib/hooks/use-pagination";
import type { PaginationResponse } from "@/types/api.types";

interface PaginationBuilderProps {
	data: PaginationResponse<unknown>;
}

interface PaginationButtonProps {
	onClick: () => void;
	icon: LucideIcon;
	label: string;
	disabled?: boolean;
}

const PaginationButton = memo(
	({ onClick, icon: Icon, label, disabled }: PaginationButtonProps) => {
		if (disabled) return null;

		return (
			<Button
				variant="outline"
				size="icon"
				className="h-8 w-8 bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700"
				onClick={onClick}
				title={label}
			>
				<Icon className="h-4 w-4" />
				<span className="sr-only">{label}</span>
			</Button>
		);
	},
);
PaginationButton.displayName = "PaginationButton";

const PageSizeSelector = memo(
	({
		size,
		onSizeChange,
	}: {
		size: number;
		onSizeChange: (size: number) => void;
	}) => {
		return (
			<Select
				value={String(size)}
				onValueChange={(val) => onSizeChange(Number(val))}
			>
				<SelectTrigger className="w-[70px] bg-slate-800/50 border-slate-700/50 text-white h-8">
					<SelectValue placeholder={String(size)} />
				</SelectTrigger>
				<SelectContent className="bg-slate-800 border-slate-700 text-white">
					<SelectItem value="1">1</SelectItem>
					<SelectItem value="10">10</SelectItem>
					<SelectItem value="20">20</SelectItem>
					<SelectItem value="50">50</SelectItem>
					<SelectItem value="100">100</SelectItem>
				</SelectContent>
			</Select>
		);
	},
);
PageSizeSelector.displayName = "PageSizeSelector";

const PageSelector = memo(
	({
		page,
		total_pages,
		onPageChange,
	}: {
		page: number;
		total_pages: number;
		onPageChange: (page: number) => void;
	}) => {
		return (
			<Select
				value={String(page)}
				onValueChange={(val) => onPageChange(Number(val))}
			>
				<SelectTrigger className="w-[70px] bg-slate-800/50 border-slate-700/50 text-white h-8">
					<SelectValue placeholder={String(page)} />
				</SelectTrigger>
				<SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
					{Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => (
						<SelectItem key={p} value={String(p)}>
							{p}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	},
);
PageSelector.displayName = "PageSelector";

const PaginationBuilder = memo(({ data }: PaginationBuilderProps) => {
	const { onPageChange, onSizeChange } = usePagination();

	const { page = 0, size, total_pages, is_first, is_last } = data;

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
			<PageSizeSelector size={size} onSizeChange={onSizeChange} />

			<div className="flex items-center gap-2">
				<div className="max-w-fit flex gap-1 text-white">
					<span>showing</span>
					<span>{data.number_of_elements}</span>
					<span>of</span>
					<span>{data.total_elements}</span>
				</div>
				<PaginationButton
					label="First Page"
					icon={ChevronsLeft}
					onClick={() => onPageChange(0)}
					disabled={is_first}
				/>

				<PaginationButton
					label="Previous Page"
					icon={ChevronLeft}
					onClick={() => onPageChange(page - 1)}
					disabled={is_first}
				/>

				<PageSelector
					page={page}
					total_pages={total_pages}
					onPageChange={onPageChange}
				/>

				<PaginationButton
					label="Next Page"
					icon={ChevronRight}
					onClick={() => onPageChange(page + 1)}
					disabled={is_last}
				/>

				<PaginationButton
					label="Last Page"
					icon={ChevronsRight}
					onClick={() => onPageChange(total_pages - 1)}
					disabled={is_last}
				/>
			</div>
		</div>
	);
});

PaginationBuilder.displayName = "PaginationBuilder";

export { PaginationBuilder };
