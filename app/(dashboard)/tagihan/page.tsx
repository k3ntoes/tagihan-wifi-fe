import { Receipt } from "lucide-react";
import TagihanListClient from "@/components/tagihan/tagihan-list-client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function TagihanPage() {
	return (
		<div className="space-y-6">
			<Card className="glass-card border-slate-700/50 animate-slide-up">
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full gradient-secondary">
							<Receipt className="h-6 w-6 text-white" />
						</div>
						<div>
							<CardTitle className="text-2xl text-white">
								Manajemen Tagihan
							</CardTitle>
							<CardDescription className="text-slate-300">
								Kelola tagihan pelanggan
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<TagihanListClient />
				</CardContent>
			</Card>
		</div>
	);
}
