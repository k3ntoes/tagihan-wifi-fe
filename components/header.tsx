"use client";

import { Bell, KeyRound, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/actions/auth";
import { useUser } from "@/lib/providers/session-provider";

export function Header() {
	const router = useRouter();
	const { user } = useUser();

	const handleLogout = async () => {
		try {
			await logoutAction();
			toast.success("Logout berhasil");
		} catch (_error) {
			toast.error("Logout gagal");
		}
	};

	const handleChangePassword = () => {
		router.push("/profile/change-password");
	};

	const handleProfile = () => {
		router.push("/profile");
	};

	return (
		<header className="h-16 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10 shadow-lg">
			<div>
				<h2 className="text-lg font-semibold text-white">
					Selamat Datang, {user?.username}
				</h2>
				<p className="text-sm text-slate-400">
					{user?.role === "ADMIN" ? "Administrator" : "User"} Dashboard
				</p>
			</div>

			<div className="flex items-center gap-4">
				{/* Notification Bell */}
				<Button
					variant="ghost"
					size="icon"
					className="text-slate-300 hover:text-white hover:bg-slate-700/50"
				>
					<Bell className="h-5 w-5" />
				</Button>

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-10 w-10 rounded-full">
							<Avatar className="h-10 w-10">
								<AvatarFallback className="gradient-primary text-white">
									{user?.username.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56 bg-slate-900/95 backdrop-blur-xl border-slate-700/50"
						align="end"
					>
						<DropdownMenuLabel className="text-white">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">{user?.username}</p>
								<p className="text-xs text-slate-400">{user?.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-slate-700/50" />
						<DropdownMenuItem
							onClick={handleProfile}
							className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
						>
							<User className="mr-2 h-4 w-4" />
							Profil
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={handleChangePassword}
							className="text-slate-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
						>
							<KeyRound className="mr-2 h-4 w-4" />
							Ubah Password
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-slate-700/50" />
						<DropdownMenuItem
							onClick={handleLogout}
							className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
