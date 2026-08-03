import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Aikouch — поддержка рядом",
	description: "Бережный AI-помощник для психологической поддержки",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
