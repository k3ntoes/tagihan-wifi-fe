"use client";

import { createContext, useContext } from "react";

interface User {
	username: string;
	role: string;
	email?: string;
	[key: string]: unknown;
}

interface SessionContextType {
	user: User | null;
}

const SessionContext = createContext<SessionContextType>({ user: null });

export function SessionProvider({
	children,
	user,
}: {
	children: React.ReactNode;
	user: User | null;
}) {
	return (
		<SessionContext.Provider value={{ user }}>
			{children}
		</SessionContext.Provider>
	);
}

export function useUser() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a SessionProvider");
	}
	return context;
}
