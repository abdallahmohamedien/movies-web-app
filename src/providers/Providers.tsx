"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useAppStore } from "@/store/store";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return <SessionProvider>{children}</SessionProvider>;
}
