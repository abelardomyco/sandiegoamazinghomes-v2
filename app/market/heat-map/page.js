import { redirect } from "next/navigation";

export const metadata = {
  title: "Market Heat Map",
  description:
    "San Diego County market heat map: neighborhood colors by overall strength (composite signal). Green = accelerating, yellow = neutral, red = declining.",
  robots: { index: false, follow: true },
};

export default function MarketHeatMapPage() {
  // Map pages removed for now.
  redirect("/market");
}
