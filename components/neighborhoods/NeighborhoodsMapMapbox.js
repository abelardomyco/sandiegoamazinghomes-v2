"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import NeighborhoodMapCard from "./NeighborhoodMapCard";
import MapboxFallback from "@/components/ui/MapboxFallback";

const SAN_DIEGO_CENTER = [-117.1611, 32.7157];
const DEFAULT_ZOOM = 9;

export default function NeighborhoodsMapMapbox({ neighborhoods = [], geoJson, accessToken }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mapboxRef = useRef(null);
  const [selectedSlug, setSelectedSlug] = useState(null);

  const neighborhoodBySlug = useCallback(
    (slug) => neighborhoods.find((n) => n.slug === slug) || null,
    [neighborhoods]
  );

  const data = geoJson && geoJson.type === "FeatureCollection" ? geoJson : { type: "FeatureCollection", features: [] };

  const initMap = useCallback(() => {
    if (!containerRef.current || !accessToken) return null;
    if (mapRef.current) return mapRef.current;

    const mapboxgl = require("mapbox-gl");
    require("mapbox-gl/dist/mapbox-gl.css");
    mapboxRef.current = mapboxgl;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: SAN_DIEGO_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      if (!map.getSource("neighborhoods")) {
        map.addSource("neighborhoods", {
          type: "geojson",
          data,
        });

        map.addLayer({
          id: "neighborhoods-fill",
          type: "fill",
          source: "neighborhoods",
          paint: {
            "fill-color": "#0f766e",
            "fill-opacity": 0.35,
            "fill-outline-color": "#0f766e",
          },
        });

        map.addLayer({
          id: "neighborhoods-outline",
          type: "line",
          source: "neighborhoods",
          paint: {
            "line-color": "#0f766e",
            "line-width": 2,
          },
        });
      }

      map.getCanvas().style.cursor = "default";
      map.on("mouseenter", "neighborhoods-fill", () => {
        map.getCanvas().style.cursor = "pointer";
        map.getPaintProperty("neighborhoods-fill", "fill-opacity") !== undefined &&
          map.setPaintProperty("neighborhoods-fill", "fill-opacity", 0.5);
      });
      map.on("mouseleave", "neighborhoods-fill", () => {
        map.getCanvas().style.cursor = "default";
        map.setPaintProperty("neighborhoods-fill", "fill-opacity", 0.35);
      });

      map.on("click", "neighborhoods-fill", (e) => {
        const f = e.features?.[0];
        const slug = f?.properties?.slug;
        if (slug) setSelectedSlug(slug);
      });
    });

    mapRef.current = map;
    return map;
  }, [accessToken, data]);

  useEffect(() => {
    if (!accessToken) return;
    const map = initMap();
    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [accessToken, initMap]);

  const selected = selectedSlug ? neighborhoodBySlug(selectedSlug) : null;

  if (!accessToken) {
    return <MapboxFallback className="min-h-[400px] rounded-xl" />;
  }

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-200">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {selected && (
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-10">
          <NeighborhoodMapCard
            neighborhood={selected}
            onClose={() => setSelectedSlug(null)}
          />
        </div>
      )}
    </div>
  );
}
