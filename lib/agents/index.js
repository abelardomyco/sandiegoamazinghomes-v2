/**
 * Agents: runner + Market Data, Content, Lead.
 * Phase 3 scaffold. No email sending.
 */

const runner = require("./runner");
const marketDataAgent = require("./market-data-agent");
const contentAgent = require("./content-agent");
const leadAgent = require("./lead-agent");

module.exports = {
  ...runner,
  marketDataAgent,
  contentAgent,
  leadAgent,
};
