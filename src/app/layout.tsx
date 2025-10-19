import "./globals.css";
import LayoutClient from "../components/LayoutClient";
import { FavoritesProvider } from "@/providers/FavoritesContext";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

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
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1f2937", 
                color: "#fff",
                borderRadius: "8px",
                border: "1px solid #374151", 
                padding: "10px 16px",
                fontSize: "0.95rem",
              },
              success: {
                iconTheme: {
                  primary: "#facc15", 
                  secondary: "#1f2937",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#1f2937",
                },
              },
            }}
          />
        </FavoritesProvider>
      </body>
    </html>
  );
}
