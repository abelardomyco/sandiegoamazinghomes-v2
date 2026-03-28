"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import MapboxFallback from "@/components/ui/MapboxFallback";

const SAN_DIEGO_CENTER = [-117.1611, 32.7157];
const DEFAULT_ZOOM = 10;

function listingsToGeoJSON(listings) {
  const features = (listings || [])
    .filter((l) => typeof l.lat === "number" && typeof l.lng === "number")
    .map((l) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [l.lng, l.lat] },
      properties: { id: String(l.id), price: l.price },
    }));
  return { type: "FeatureCollection", features };
}

export default function ListingsMap({ listings = [], onMarkerClick, className = "", accessToken }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mapboxRef = useRef(null);

  const geoJSON = useMemo(() => listingsToGeoJSON(listings), [listings]);

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
      if (!map.getSource("listings")) {
        map.addSource("listings", {
          type: "geojson",
          data: geoJSON,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "listings",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#0f766e",
            "circle-radius": ["step", ["get", "point_count"], 20, 10, 28, 50, 40],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "listings",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#fff" },
        });

        map.addLayer({
          id: "unclustered",
          type: "circle",
          source: "listings",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#0f766e",
            "circle-radius": 10,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });
      }

      if (geoJSON.features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        geoJSON.features.forEach((f) => bounds.extend(f.geometry.coordinates));
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    });

    map.getCanvas().style.cursor = "default";
    map.on("mouseenter", "unclustered", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "unclustered", () => { map.getCanvas().style.cursor = "default"; });
    map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = "default"; });

    map.on("click", "unclustered", (e) => {
      const id = e.features?.[0]?.properties?.id;
      if (id && onMarkerClick) onMarkerClick(id);
    });

    map.on("click", "clusters", (e) => {
      const clusterId = e.features?.[0]?.properties?.cluster_id;
      if (clusterId == null) return;
      const point = e.lngLat;
      const source = map.getSource("listings");
      if (!source) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: [point.lng, point.lat], zoom });
      });
    });

    mapRef.current = map;
    return map;
  }, [accessToken, onMarkerClick]);

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

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource("listings");
    if (source) {
      source.setData(geoJSON);
      if (geoJSON.features.length > 0 && mapboxRef.current) {
        const mapboxgl = mapboxRef.current;
        const bounds = new mapboxgl.LngLatBounds();
        geoJSON.features.forEach((f) => bounds.extend(f.geometry.coordinates));
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    }
  }, [geoJSON]);

  if (!accessToken) {
    return (
      <MapboxFallback className={`min-h-[300px] ${className}`} />
    );
  }

  return <div ref={containerRef} className={`w-full h-full min-h-[300px] rounded-lg ${className}`} />;
}
