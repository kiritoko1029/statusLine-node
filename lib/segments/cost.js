/**
 * Cost segment - displays total cost
 */

/**
 * Format cost as USD
 * @param {number} cost - Cost in USD
 * @returns {string}
 */
function formatCost(cost) {
  if (cost === undefined || cost === null) {
    return '$0.0000';
  }
  return `$${cost.toFixed(4)}`;
}

/**
 * Get total cost
 * @param {Object} ctx - Context
 * @param {Object} ctx.cost - Cost info
 * @returns {string|null}
 */
function getCost(ctx) {
  if (!ctx.cost || ctx.cost.total_cost_usd === undefined) {
    return null;
  }
  return formatCost(ctx.cost.total_cost_usd);
}

module.exports = { getCost, formatCost };
