"use client";

import { useEffect, useRef } from "react";
import MapboxFallback from "@/components/ui/MapboxFallback";

export default function PropertyMap({ listing, accessToken }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !accessToken || !listing?.lat || !listing?.lng) return;

    const mapboxgl = require("mapbox-gl");
    require("mapbox-gl/dist/mapbox-gl.css");

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [listing.lng, listing.lat],
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      new mapboxgl.Marker({ color: "#0f766e" })
        .setLngLat([listing.lng, listing.lat])
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken, listing?.lat, listing?.lng]);

  if (!accessToken) {
    return <MapboxFallback className="w-full min-h-[200px]" compact />;
  }

  return <div ref={containerRef} className="w-full h-full min-h-[200px]" />;
}
