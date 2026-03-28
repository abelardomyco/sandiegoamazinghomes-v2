/**
 * Market data service layer.
 * Phase 1: foundation. Neighborhood stats and market reports (Supabase + optional adapters).
 */

const stats = require("./stats");
const reports = require("./reports");

module.exports = {
  ...stats,
  ...reports,
};
