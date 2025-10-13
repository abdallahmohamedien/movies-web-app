import "./globals.css";
import LayoutClient from "../components/LayoutClient";
import { FavoritesProvider } from "@/providers/FavoritesContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Movie Project",
  description: "A Next.js movie app using TMDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <FavoritesProvider>
          <LayoutClient>{children}</LayoutClient>
        </FavoritesProvider>
      </body>
    </html>
  );
}
