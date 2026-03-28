"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import ListingsMap from "./ListingsMap";

export default function MapPageClient({ listings = [], mapboxToken }) {
  const router = useRouter();
  const handleMarkerClick = useCallback(
    (id) => {
      void id;
      router.push("/#contact");
    },
    [router]
  );

  return (
    <ListingsMap
      listings={listings}
      onMarkerClick={handleMarkerClick}
      accessToken={mapboxToken}
      className="w-full h-full"
    />
  );
}
