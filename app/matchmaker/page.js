import Link from "next/link";
import { getNeighborhoodIndex } from "@/lib/content";
import MatchmakerWidget from "@/components/matchmaker/MatchmakerWidget";

export const metadata = {
  title: "Find Your Area | San Diego Amazing Homes",
  description: "Quick neighborhood match—use the assistant on the home page.",
  robots: { index: false, follow: true },
};

export default function MatchmakerPage() {
  const neighborhoods = getNeighborhoodIndex();
  return (
    <div className="max-w-md mx-auto space-y-4 py-6">
      <p className="text-slate-600 text-center text-sm">
        Find your area with the quick assistant on the <Link href="/" className="text-sd-600 font-medium hover:underline">home page</Link>, or use the floating button in the corner.
      </p>
      <MatchmakerWidget neighborhoods={neighborhoods} mode="inline" defaultOpen />
    </div>
  );
}
