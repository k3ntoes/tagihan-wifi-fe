import { TagihanForm } from "@/components/tagihan/tagihan-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateTagihanPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Card className="glass-card border-slate-700/50 animate-slide-up">
				<CardHeader>
					<CardTitle className="text-2xl text-white">
						Buat Tagihan Baru
					</CardTitle>
				</CardHeader>
				<CardContent>
					<TagihanForm />
				</CardContent>
			</Card>
		</div>
	);
}
