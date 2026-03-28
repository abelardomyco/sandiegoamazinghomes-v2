"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import Link from "next/link";
import HeatMapFallback from "@/components/market/HeatMapFallback";

const SAN_DIEGO_CENTER = [-117.1611, 32.7157];
const DEFAULT_ZOOM = 9;

const HEAT_COLORS = {
  red: "#dc2626",
  yellow: "#eab308",
  green: "#16a34a",
};

const METRICS = [
  { id: "marketStrength", label: "Overall strength", description: "Composite signal" },
];

function clamp01(n) {
  return Math.max(0, Math.min(1, typeof n === "number" ? n : 0.5));
}

function compositeStrength(m) {
  // Keep weights aligned with lib/market-data.js MARKET_STRENGTH_WEIGHTS
  const priceGrowth = clamp01(m?.priceGrowth);
  const inventoryPressure = clamp01(m?.inventoryPressure);
  const daysOnMarket = clamp01(m?.daysOnMarket);
  const priceReductions = clamp01(m?.priceReductions);
  return (
    0.35 * priceGrowth +
    0.25 * inventoryPressure +
    0.25 * daysOnMarket +
    0.15 * priceReductions
  );
}

/**
 * Enrich GeoJSON features with heatValue from heatData for the selected metric.
 * heatValue 0 = red (declining), 0.5 = yellow (neutral), 1 = green (accelerating).
 */
function enrichGeoWithHeat(geoJson, heatData) {
  if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
    return { type: "FeatureCollection", features: [] };
  }
  const defaultHeat = 0.5;
  const features = geoJson.features.map((f) => {
    const slug = f.properties?.slug;
    const m = heatData[slug];
    const heatValue = m ? compositeStrength(m) : defaultHeat;
    return {
      ...f,
      properties: {
        ...f.properties,
        heatValue,
      },
    };
  });
  return { type: "FeatureCollection", features };
}

export default function MarketHeatMap({ geoJson, heatData, accessToken }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mapboxRef = useRef(null);
  const [hoveredSlug, setHoveredSlug] = useState(null);

  const data = useMemo(
    () => (geoJson && geoJson.type === "FeatureCollection" ? geoJson : { type: "FeatureCollection", features: [] }),
    [geoJson]
  );
  const heatMap = useMemo(
    () => (heatData && typeof heatData === "object" ? heatData : {}),
    [heatData]
  );

  const enrichedData = useCallback(
    () => enrichGeoWithHeat(data, heatMap),
    [data, heatMap]
  );

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
      const initialGeo = enrichedData();
      if (!map.getSource("neighborhoods-heat")) {
        map.addSource("neighborhoods-heat", {
          type: "geojson",
          data: initialGeo,
        });

        map.addLayer({
          id: "neighborhoods-heat-fill",
          type: "fill",
          source: "neighborhoods-heat",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "heatValue"],
              0,
              HEAT_COLORS.red,
              0.5,
              HEAT_COLORS.yellow,
              1,
              HEAT_COLORS.green,
            ],
            "fill-opacity": 0.7,
            "fill-outline-color": "#64748b",
          },
        });

        map.addLayer({
          id: "neighborhoods-heat-outline",
          type: "line",
          source: "neighborhoods-heat",
          paint: {
            "line-color": "#475569",
            "line-width": 1.5,
          },
        });
      }

      map.getCanvas().style.cursor = "default";
      map.on("mouseenter", "neighborhoods-heat-fill", () => {
        map.getCanvas().style.cursor = "pointer";
        map.setPaintProperty("neighborhoods-heat-fill", "fill-opacity", 0.85);
      });
      map.on("mouseleave", "neighborhoods-heat-fill", () => {
        map.getCanvas().style.cursor = "default";
        map.setPaintProperty("neighborhoods-heat-fill", "fill-opacity", 0.7);
        setHoveredSlug(null);
      });

      map.on("mousemove", "neighborhoods-heat-fill", (e) => {
        const f = e.features?.[0];
        const slug = f?.properties?.slug;
        setHoveredSlug(slug || null);
      });

      map.on("click", "neighborhoods-heat-fill", (e) => {
        const f = e.features?.[0];
        const slug = f?.properties?.slug;
        if (slug) {
          window.location.href = `/neighborhoods/${slug}`;
        }
      });
    });

    mapRef.current = map;
    return map;
  }, [accessToken, enrichedData]);

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

  // When metric changes, update source data
  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource("neighborhoods-heat");
    if (source && source.setData) {
      source.setData(enrichedData());
    }
  }, [enrichedData]);

  const currentMetricLabel = "Overall strength";

  if (!accessToken) {
    return (
      <div className="relative w-full min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        <div className="p-3 border-b border-slate-200 bg-white">
          <p className="text-sm font-semibold text-slate-900">Market heat map</p>
          <p className="text-xs text-slate-500 mt-0.5">Overall neighborhood strength (composite signal).</p>
        </div>
        <HeatMapFallback
          heatData={heatMap}
          metric={"marketStrength"}
          metricLabel={currentMetricLabel}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Legend */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-start gap-3">
        <div className="px-3 py-2 rounded-lg bg-white/95 shadow border border-slate-200">
          <p className="text-xs font-semibold text-slate-800">Overall market strength</p>
          <p className="text-[11px] text-slate-500">Composite of price trend, speed, inventory, reductions.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 shadow border border-slate-200 text-xs text-slate-600">
          <span className="font-medium text-slate-700">Heat:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-600" aria-hidden />
            Accelerating
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden />
            Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-600" aria-hidden />
            Declining
          </span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredSlug && (
        <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded bg-white/95 shadow border border-slate-200 text-sm text-slate-700 min-w-[240px]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium capitalize">{hoveredSlug.replace(/-/g, " ")}</span>
            <Link href="/#contact" className="text-sd-600 hover:underline text-xs font-semibold">
              Ask →
            </Link>
          </div>
          <div className="mt-2 space-y-1 text-[11px] text-slate-600">
            {(() => {
              const m = heatMap?.[hoveredSlug];
              if (!m) return <span className="text-slate-500">No breakdown available.</span>;
              const row = [
                ["Price trend", m.priceGrowth],
                ["Inventory", m.inventoryPressure],
                ["Speed", m.daysOnMarket],
                ["Reductions", m.priceReductions],
              ];
              return row.map(([label, v]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span>{label}</span>
                  <span className="tabular-nums text-slate-700">{Math.round(clamp01(v) * 100)}%</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      <p className="absolute bottom-4 right-4 z-10 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
        {currentMetricLabel}. Click a neighborhood to read the guide.
      </p>
    </div>
  );
}
