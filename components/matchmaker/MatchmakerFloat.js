"use client";

import { usePathname } from "next/navigation";
import MatchmakerWidget from "./MatchmakerWidget";

export default function MatchmakerFloat({ neighborhoods = [] }) {
  const pathname = usePathname();
  if (pathname === "/matchmaker") return null;
  return <MatchmakerWidget neighborhoods={neighborhoods} mode="floating" />;
}
