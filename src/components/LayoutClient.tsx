"use client";

import Header from "@/components/Header";
import { FavoritesProvider } from "@/providers/FavoritesContext";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const hideHeader = pathname === "/signin" || pathname === "/signup";

  return (
    <SessionProviderWrapper>
      <FavoritesProvider>
        {!hideHeader && <Header />}
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8" suppressHydrationWarning={true}>{children}</div>
        </main>
      </FavoritesProvider>
    </SessionProviderWrapper>
  );
}
