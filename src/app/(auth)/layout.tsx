import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - My Movie Project",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
