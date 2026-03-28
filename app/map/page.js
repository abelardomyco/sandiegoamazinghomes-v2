import { redirect } from "next/navigation";

export const metadata = {
  title: "Map",
  description: "Browse San Diego County homes for sale.",
  robots: { index: false, follow: true },
};

export default function MapPage() {
  // Map pages removed for now.
  redirect("/");
}
