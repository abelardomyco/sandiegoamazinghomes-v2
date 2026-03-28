/**
 * Email / newsletter service layer.
 * Phase 1: foundation. Newsletter issue tracking; sending remains via existing or future provider.
 */

const newsletter = require("./newsletter");

module.exports = {
  ...newsletter,
};
