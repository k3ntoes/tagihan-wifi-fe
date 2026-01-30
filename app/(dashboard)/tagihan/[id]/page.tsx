import { TagihanForm } from "@/components/tagihan/tagihan-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTagihanById } from "@/lib/actions/tagihan";

interface EditTagihanPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditTagihanPage({
	params,
}: EditTagihanPageProps) {
	const { id } = await params;
	const tagihan = await getTagihanById(id);

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Card className="glass-card border-slate-700/50 animate-slide-up">
				<CardHeader>
					<CardTitle className="text-2xl text-white">Edit Tagihan</CardTitle>
				</CardHeader>
				<CardContent>
					<TagihanForm initialData={tagihan} isEdit />
				</CardContent>
			</Card>
		</div>
	);
}
