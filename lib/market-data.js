/**
 * Market page data layer for /market.
 * Uses placeholder data when neighborhood_market_stats / market_reports APIs are not connected.
 * TODO: Production — use lib/market (getNeighborhoodStats, getMarketReportBySlug) and adapters.
 */

const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const { getNeighborhoodIndex } = require("./content");

const PLACEHOLDER_PATH = join(process.cwd(), "data", "market-placeholder.json");

function loadMarketPlaceholder() {
  if (!existsSync(PLACEHOLDER_PATH)) return null;
  try {
    return JSON.parse(readFileSync(PLACEHOLDER_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function getMarketSnapshot() {
  const data = loadMarketPlaceholder();
  if (data && data.snapshot) return data.snapshot;
  return {
    medianPrice: 925000,
    pricePerSqft: 580,
    inventory: 1100,
    activeListings: 1100,
    daysOnMarket: 32,
    newListingsTrend: null,
    mortgageRate: 6.85,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function getMonthsOfInventory() {
  const data = loadMarketPlaceholder();
  if (data != null && typeof data.monthsOfInventory === "number") return data.monthsOfInventory;
  return 2.5;
}

function getPriceTrend12mo() {
  const data = loadMarketPlaceholder();
  if (data && data.priceTrend12mo && data.priceTrend12mo.length) return data.priceTrend12mo;
  return [];
}

function getPricePerSqftTrend() {
  const data = loadMarketPlaceholder();
  if (data && data.pricePerSqftTrend && data.pricePerSqftTrend.length) return data.pricePerSqftTrend;
  return [];
}

function getLeaderboards() {
  const data = loadMarketPlaceholder();
  return {
    hottest: (data && data.hottestNeighborhoods) || [],
    bestValue: (data && data.bestValueNeighborhoods) || [],
    fastestSelling: (data && data.fastestSellingAreas) || [],
  };
}

function getLuxuryMarket() {
  const data = loadMarketPlaceholder();
  if (data && data.luxury) return data.luxury;
  return {
    thresholdPrice: 2000000,
    listingCount: 0,
    avgDaysOnMarket: null,
    medianPrice: null,
  };
}

function getMortgageWidget() {
  const data = loadMarketPlaceholder();
  if (data && data.mortgage) return data.mortgage;
  const snapshot = getMarketSnapshot();
  const rate = snapshot.mortgageRate ?? 6.75;
  return {
    rate,
    rateDirection: null,
    rateNote: null,
    paymentExamples: [
      { price: 750000, payment: Math.round((750000 * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -360))) },
      { price: 950000, payment: Math.round((950000 * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -360))) },
      { price: 1500000, payment: Math.round((1500000 * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -360))) },
    ],
  };
}

/** Inventory pressure label + supporting metric for signal card. */
function getInventoryPressure() {
  const data = loadMarketPlaceholder();
  if (data && data.inventoryPressure && typeof data.inventoryPressure.label === "string") {
    return data.inventoryPressure;
  }
  const months = getMonthsOfInventory();
  const buyerAdv = getBuyerAdvantage();
  const label = buyerAdv.label || (months >= 4 ? "Cooling" : months <= 2 ? "Seller's market" : "Balanced");
  return {
    label,
    metric: months != null ? `${Number(months).toFixed(1)} mo supply` : null,
  };
}

/**
 * Compact signal data for top dashboard cards (no charts).
 * pricePerSqftPct, daysOnMarketPct, salesVolumePct = percentage change (e.g. +2.1).
 * For DOM: improving = fewer days = good = green (negative pct or drop).
 */
function getMarketSignals() {
  const statBand = getMarketStatBandData();
  const priceTrend = getPricePerSqftTrend();
  const domTrend = getDaysOnMarketTrend();
  const salesTrend = getSalesVolumeTrend();
  const mortgage = getMortgageWidget();
  const inventory = getInventoryPressure();
  const last = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null);
  const prev = (arr) => (Array.isArray(arr) && arr.length > 1 ? arr[arr.length - 2] : null);
  const pct = (cur, prevVal) => (prevVal != null && prevVal !== 0 ? ((cur - prevVal) / prevVal) * 100 : null);

  const priceLast = last(priceTrend);
  const pricePrev = prev(priceTrend);
  const domLast = last(domTrend);
  const domPrev = prev(domTrend);
  const salesLast = last(salesTrend);
  const salesPrev = prev(salesTrend);

  const pricePerSqftPct = priceLast && pricePrev ? pct(priceLast.pricePerSqft, pricePrev.pricePerSqft) : statBand.medianPriceDelta;
  const daysOnMarketPct = domLast && domPrev ? pct(domLast.daysOnMarket, domPrev.daysOnMarket) : null;
  const salesVolumePct = salesLast && salesPrev ? pct(salesLast.sales, salesPrev.sales) : statBand.salesVolumeDelta;

  return {
    pricePerSqft: statBand.pricePerSqft,
    pricePerSqftPct: pricePerSqftPct != null ? Number(pricePerSqftPct.toFixed(1)) : null,
    pricePerSqftDirection: pricePerSqftPct == null ? null : pricePerSqftPct >= 0 ? "up" : "down",
    daysOnMarket: statBand.daysOnMarket,
    daysOnMarketPct: daysOnMarketPct != null ? Number(daysOnMarketPct.toFixed(1)) : null,
    daysOnMarketImproving: domLast && domPrev ? domLast.daysOnMarket <= domPrev.daysOnMarket : null,
    salesVolume: statBand.salesVolume,
    salesVolumePct: salesVolumePct != null ? Number(salesVolumePct.toFixed(1)) : null,
    salesVolumeDirection: salesVolumePct == null ? null : salesVolumePct >= 0 ? "up" : "down",
    rate: mortgage.rate,
    rateDirection: mortgage.rateDirection ?? "stable",
    rateNote: mortgage.rateNote || "Rates influence buying power; we can help you run scenarios.",
    inventoryLabel: inventory.label,
    inventoryMetric: inventory.metric,
  };
}

/** 2–3 sentence market takeaway. From placeholder or derived. */
function getMarketTakeaway() {
  const data = loadMarketPlaceholder();
  if (data && data.marketTakeaway && typeof data.marketTakeaway === "string") return data.marketTakeaway.trim();
  const insight = getRosameliaInsight();
  if (insight) return insight.slice(0, 280) + (insight.length > 280 ? "…" : "");
  return "San Diego County remains a strong market with limited inventory in sought-after areas. Coastal and move-up neighborhoods see fast movement; value-focused buyers have more room in areas with higher supply.";
}

function getRentalMarket() {
  const data = loadMarketPlaceholder();
  if (data && data.rental) return data.rental;
  return {
    medianRent: 2800,
    rentGrowthYoy: null,
    rentVsBuyRatio: null,
  };
}

function getInventoryTrend() {
  const data = loadMarketPlaceholder();
  if (data && data.inventoryTrend && data.inventoryTrend.length) return data.inventoryTrend;
  return [];
}

function getDaysOnMarketTrend() {
  const data = loadMarketPlaceholder();
  if (data && data.daysOnMarketTrend && data.daysOnMarketTrend.length) return data.daysOnMarketTrend;
  return [];
}

function getSalesVolumeTrend() {
  const data = loadMarketPlaceholder();
  if (data && data.salesVolumeTrend && data.salesVolumeTrend.length) return data.salesVolumeTrend;
  return [];
}

function getPriceReductionTrend() {
  const data = loadMarketPlaceholder();
  if (data && data.priceReductionTrend && data.priceReductionTrend.length) return data.priceReductionTrend;
  return [];
}

function getCoolingNeighborhoods() {
  const data = loadMarketPlaceholder();
  if (data && data.coolingNeighborhoods && data.coolingNeighborhoods.length) return data.coolingNeighborhoods;
  return [];
}

function getHotNeighborhoods() {
  const data = loadMarketPlaceholder();
  const index = getNeighborhoodIndex();
  const slugs = (data && data.hotNeighborhoods) ? data.hotNeighborhoods.map((h) => h.slug) : [];
  if (slugs.length === 0 && index.length > 0) {
    return index.filter((n) => n.featured).slice(0, 4).map((n) => ({
      slug: n.slug,
      name: n.name,
      blurb: n.shortIntro || n.region,
    }));
  }
  return ((data && data.hotNeighborhoods) || []).map((h) => {
    const n = index.find((x) => x.slug === h.slug);
    return {
      slug: h.slug,
      name: (n && n.name) ? n.name : h.name,
      blurb: h.blurb || (n && n.shortIntro) || "",
    };
  });
}

function getMonthlyHighlights() {
  const data = loadMarketPlaceholder();
  if (data && data.monthlyHighlights && data.monthlyHighlights.length) return data.monthlyHighlights;
  return [
    { title: "Market Snapshot", summary: "Placeholder. Connect market_reports or newsletter content.", slug: "snapshot" },
    { title: "Price Trends", summary: "Placeholder.", slug: "trends" },
    { title: "Hot Neighborhoods", summary: "Placeholder.", slug: "hot" },
  ];
}

/** Buyer advantage: score 1–10 (1 = buyer's market, 10 = seller's market), label. Computed from monthsOfInventory, DOM, price trend if not in JSON. */
function getBuyerAdvantage() {
  const data = loadMarketPlaceholder();
  if (data && data.buyerAdvantage && typeof data.buyerAdvantage.score === "number") {
    return data.buyerAdvantage;
  }
  const months = getMonthsOfInventory();
  const snapshot = getMarketSnapshot();
  const dom = snapshot.daysOnMarket ?? 30;
  let score = 5;
  if (months >= 4) score -= 2;
  else if (months >= 3) score -= 1;
  else if (months < 2) score += 2;
  else if (months < 2.5) score += 1;
  if (dom >= 45) score -= 1;
  else if (dom <= 20) score += 1;
  score = Math.max(1, Math.min(10, score));
  const label = score <= 3 ? "Buyer's market" : score >= 7 ? "Seller's market" : "Balanced";
  return { score, label };
}

function getPriceChangeWatch() {
  const data = loadMarketPlaceholder();
  if (data && data.priceChangeWatch && data.priceChangeWatch.length) return data.priceChangeWatch;
  return [];
}

function getRosameliaInsight() {
  const data = loadMarketPlaceholder();
  if (data && data.rosameliaInsight && typeof data.rosameliaInsight === "string") return data.rosameliaInsight.trim();
  return null;
}

/**
 * Per-neighborhood heat values (0 = declining/red, 0.5 = neutral/yellow, 1 = accelerating/green).
 * Used by market heat map. Keys: priceGrowth, inventoryPressure, daysOnMarket, priceReductions.
 * priceReductions: 0 = more reductions (red), 1 = fewer (green).
 * @returns {{ [slug: string]: { priceGrowth: number, inventoryPressure: number, daysOnMarket: number, priceReductions?: number } }}
 */
function getNeighborhoodHeatMetrics() {
  const data = loadMarketPlaceholder();
  const list = (data && data.neighborhoodHeatMetrics) || [];
  const out = {};
  const defaultHeat = 0.5;
  for (const row of list) {
    if (row && row.slug) {
      out[row.slug] = {
        priceGrowth: typeof row.priceGrowth === "number" ? row.priceGrowth : defaultHeat,
        inventoryPressure: typeof row.inventoryPressure === "number" ? row.inventoryPressure : defaultHeat,
        daysOnMarket: typeof row.daysOnMarket === "number" ? row.daysOnMarket : defaultHeat,
        priceReductions: typeof row.priceReductions === "number" ? row.priceReductions : defaultHeat,
      };
    }
  }
  return out;
}

/** Weights for composite market strength: priceGrowth, inventoryPressure, daysOnMarket, priceReductions (all 0–1). */
const MARKET_STRENGTH_WEIGHTS = [0.35, 0.25, 0.25, 0.15];

/**
 * Returns neighborhood heat metrics as an array with computed marketStrength for matrix/rankings.
 * marketStrength = weighted average of priceGrowth, inventoryPressure, daysOnMarket, priceReductions (0–1).
 * @returns {Array<{ slug: string, name: string, priceGrowth: number, inventoryPressure: number, daysOnMarket: number, priceReductions: number, marketStrength: number }>}
 */
function getNeighborhoodHeatMetricsForMatrix() {
  const heat = getNeighborhoodHeatMetrics();
  const index = getNeighborhoodIndex();
  const bySlug = new Map(index.map((n) => [n.slug, n.name]));
  return Object.entries(heat).map(([slug, m]) => {
    const priceGrowth = m.priceGrowth ?? 0.5;
    const inventoryPressure = m.inventoryPressure ?? 0.5;
    const daysOnMarket = m.daysOnMarket ?? 0.5;
    const priceReductions = m.priceReductions ?? 0.5;
    const marketStrength =
      MARKET_STRENGTH_WEIGHTS[0] * priceGrowth +
      MARKET_STRENGTH_WEIGHTS[1] * inventoryPressure +
      MARKET_STRENGTH_WEIGHTS[2] * daysOnMarket +
      MARKET_STRENGTH_WEIGHTS[3] * priceReductions;
    return {
      slug,
      name: bySlug.get(slug) || slug.replace(/-/g, " "),
      priceGrowth,
      inventoryPressure,
      daysOnMarket,
      priceReductions,
      marketStrength,
    };
  });
}

/**
 * Scoreboard table data: neighborhood, median price, price trend, days on market, market strength label.
 * Used by MarketScoreboard. Derives from matrix + snapshot + priceChangeWatch + fastestSellingAreas.
 */
function getNeighborhoodScoreboardData() {
  const matrix = getNeighborhoodHeatMetricsForMatrix();
  const snapshot = getMarketSnapshot();
  const data = loadMarketPlaceholder();
  const priceChangeWatch = getPriceChangeWatch();
  const fastestSelling = (data && data.fastestSellingAreas) || [];
  const neighborhoodMedianPrices = (data && data.neighborhoodMedianPrices) || {};
  const bySlugPriceChange = new Map((priceChangeWatch || []).map((p) => [p.slug, p.priceChangePct]));
  const bySlugDOM = new Map((fastestSelling || []).map((f) => [f.slug, f.avgDOM]));
  const defaultMedian = snapshot.medianPrice ?? 0;
  return matrix.map((row) => {
    const medianPrice = neighborhoodMedianPrices[row.slug] != null ? neighborhoodMedianPrices[row.slug] : defaultMedian;
    const priceTrendPct = bySlugPriceChange.get(row.slug);
    const priceTrend =
      priceTrendPct != null
        ? (priceTrendPct >= 0 ? "+" : "") + priceTrendPct.toFixed(1) + "%"
        : ((row.priceGrowth - 0.5) * 10).toFixed(1) + "%";
    const dom = bySlugDOM.get(row.slug);
    const daysOnMarket = dom != null ? String(dom) : "—";
    const marketStrengthLabel =
      row.marketStrength >= 0.6 ? "Hot" : row.marketStrength >= 0.4 ? "Balanced" : "Cooling";
    return {
      slug: row.slug,
      neighborhood: row.name,
      medianPrice,
      priceTrend,
      daysOnMarket,
      marketStrengthLabel,
    };
  });
}

/**
 * Data for the top stat band: 6 metrics + optional deltas.
 * salesVolume and priceReductionRate from latest trend points.
 */
function getMarketStatBandData() {
  const snapshot = getMarketSnapshot();
  const salesTrend = getSalesVolumeTrend();
  const reductionTrend = getPriceReductionTrend();
  const priceTrend = getPriceTrend12mo();
  const invTrend = getInventoryTrend();
  const domTrend = getDaysOnMarketTrend();
  const last = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null);
  const prev = (arr) => (Array.isArray(arr) && arr.length > 1 ? arr[arr.length - 2] : null);
  const salesLast = last(salesTrend);
  const reductionLast = last(reductionTrend);
  const priceLast = last(priceTrend);
  const pricePrev = prev(priceTrend);
  const invLast = last(invTrend);
  const invPrev = prev(invTrend);
  const domLast = last(domTrend);
  const domPrev = prev(domTrend);
  const pct = (cur, prev) => (prev && prev > 0 ? ((cur - prev) / prev) * 100 : null);
  return {
    medianPrice: snapshot.medianPrice ?? priceLast?.medianPrice ?? 0,
    activeListings: snapshot.activeListings ?? snapshot.inventory ?? invLast?.inventory ?? 0,
    daysOnMarket: snapshot.daysOnMarket ?? domLast?.daysOnMarket ?? 0,
    pricePerSqft: snapshot.pricePerSqft ?? 0,
    salesVolume: salesLast?.sales ?? 0,
    priceReductionRate: reductionLast?.pctListingsReduced ?? 0,
    medianPriceDelta: priceLast && pricePrev ? pct(priceLast.medianPrice, pricePrev.medianPrice) : null,
    activeListingsDelta: invLast && invPrev ? pct(invLast.inventory, invPrev.inventory) : null,
    daysOnMarketDelta: domLast && domPrev ? (domLast.daysOnMarket - domPrev.daysOnMarket) : null,
    salesVolumeDelta: salesLast && prev(salesTrend) ? pct(salesLast.sales, prev(salesTrend).sales) : null,
    priceReductionRateDelta:
      reductionLast && prev(reductionTrend)
        ? reductionLast.pctListingsReduced - prev(reductionTrend).pctListingsReduced
        : null,
  };
}

module.exports = {
  getMarketStatBandData,
  getMarketSignals,
  getInventoryPressure,
  getMarketTakeaway,
  getNeighborhoodHeatMetricsForMatrix,
  getNeighborhoodScoreboardData,
  getMarketSnapshot,
  getInventoryTrend,
  getDaysOnMarketTrend,
  getSalesVolumeTrend,
  getPriceReductionTrend,
  getCoolingNeighborhoods,
  getHotNeighborhoods,
  getMonthlyHighlights,
  getMonthsOfInventory,
  getPriceTrend12mo,
  getPricePerSqftTrend,
  getLeaderboards,
  getLuxuryMarket,
  getMortgageWidget,
  getRentalMarket,
  getBuyerAdvantage,
  getPriceChangeWatch,
  getRosameliaInsight,
  getNeighborhoodHeatMetrics,
};
