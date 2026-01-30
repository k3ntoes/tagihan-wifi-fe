"use client";

import { Package, Receipt, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/providers/session-provider";

export function DashboardClient() {
	const { user } = useUser();
	const isAdmin = user?.role === "ADMIN";

	return (
		<div className="space-y-6">
			{/* Welcome Card */}
			<Card className="glass-card border-slate-700/50 animate-slide-up">
				<CardHeader>
					<CardTitle className="text-2xl text-white">
						Selamat Datang, {user?.username}! 👋
					</CardTitle>
					<p className="text-slate-300 mt-2">
						{isAdmin
							? "Kelola paket WiFi, pelanggan, dan tagihan dari dashboard ini."
							: "Lihat tagihan dan status pembayaran Anda di sini."}
					</p>
				</CardHeader>
			</Card>

			{/* Stats Grid - Only for ADMIN */}
			{isAdmin && (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<Card className="glass-card border-slate-700/50 hover:scale-105 transition-transform animate-slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-slate-300">
								Total Paket
							</CardTitle>
							<div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
								<Package className="h-5 w-5 text-white" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">12</div>
							<p className="text-xs text-slate-400 mt-1">Paket WiFi aktif</p>
						</CardContent>
					</Card>

					<Card
						className="glass-card border-slate-700/50 hover:scale-105 transition-transform animate-slide-up"
						style={{ animationDelay: "0.1s" }}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-slate-300">
								Total Pelanggan
							</CardTitle>
							<div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center">
								<Users className="h-5 w-5 text-white" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">156</div>
							<p className="text-xs text-slate-400 mt-1">Pelanggan aktif</p>
						</CardContent>
					</Card>

					<Card
						className="glass-card border-slate-700/50 hover:scale-105 transition-transform animate-slide-up"
						style={{ animationDelay: "0.2s" }}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-slate-300">
								Tagihan Bulan Ini
							</CardTitle>
							<div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
								<Receipt className="h-5 w-5 text-white" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">143</div>
							<p className="text-xs text-slate-400 mt-1">Total tagihan</p>
						</CardContent>
					</Card>

					<Card
						className="glass-card border-slate-700/50 hover:scale-105 transition-transform animate-slide-up"
						style={{ animationDelay: "0.3s" }}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-slate-300">
								Pendapatan Bulan Ini
							</CardTitle>
							<div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
								<TrendingUp className="h-5 w-5 text-white" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">Rp 42.5Jt</div>
							<p className="text-xs text-green-400 mt-1">
								+12.5% dari bulan lalu
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Quick Actions */}
			<Card
				className="glass-card border-slate-700/50 animate-slide-up"
				style={{ animationDelay: "0.4s" }}
			>
				<CardHeader>
					<CardTitle className="text-xl text-white">Aksi Cepat</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{isAdmin ? (
						<>
							<a
								href="/paket/new"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<Package className="h-8 w-8 text-blue-400 mb-2" />
								<h3 className="font-semibold text-white">Tambah Paket</h3>
								<p className="text-sm text-slate-400 mt-1">
									Buat paket WiFi baru
								</p>
							</a>
							<a
								href="/pelanggan/new"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<Users className="h-8 w-8 text-green-400 mb-2" />
								<h3 className="font-semibold text-white">Tambah Pelanggan</h3>
								<p className="text-sm text-slate-400 mt-1">
									Daftarkan pelanggan baru
								</p>
							</a>
							<a
								href="/tagihan/new"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<Receipt className="h-8 w-8 text-purple-400 mb-2" />
								<h3 className="font-semibold text-white">Buat Tagihan</h3>
								<p className="text-sm text-slate-400 mt-1">
									Tambah tagihan baru
								</p>
							</a>
							<a
								href="/tagihan/summary"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<TrendingUp className="h-8 w-8 text-orange-400 mb-2" />
								<h3 className="font-semibold text-white">Lihat Laporan</h3>
								<p className="text-sm text-slate-400 mt-1">
									Analisis pendapatan
								</p>
							</a>
						</>
					) : (
						<>
							<a
								href="/tagihan"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<Receipt className="h-8 w-8 text-purple-400 mb-2" />
								<h3 className="font-semibold text-white">Tagihan Saya</h3>
								<p className="text-sm text-slate-400 mt-1">
									Lihat semua tagihan
								</p>
							</a>
							<a
								href="/tagihan/summary"
								className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all hover:scale-105 cursor-pointer"
							>
								<TrendingUp className="h-8 w-8 text-orange-400 mb-2" />
								<h3 className="font-semibold text-white">Lihat Summary</h3>
								<p className="text-sm text-slate-400 mt-1">
									Riwayat pembayaran
								</p>
							</a>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
