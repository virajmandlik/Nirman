/**
 * Async handler middleware to avoid try/catch blocks in route handlers
 * @param {Function} fn Function that needs to be wrapped with try/catch
 * @returns {Function} Express middleware
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 