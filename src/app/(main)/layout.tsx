import "../../globals.css";
import LayoutClient from "@/components/LayoutClient";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "My Movie Project",
  description: "A Next.js movie app using TMDB.",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
