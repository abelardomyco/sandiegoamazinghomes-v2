import { redirect } from "next/navigation";

export const metadata = {
  title: "Neighborhoods | San Diego Amazing Homes",
  description: "Explore San Diego neighborhoods.",
  robots: { index: false, follow: true },
};

export default function NeighborhoodMapPage() {
  redirect("/neighborhoods");
}

