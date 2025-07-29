import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-chat-elements/dist/main.css"

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
	title: "Aikouch",
	description: "Сhat bot for psychological support",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.variable}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
