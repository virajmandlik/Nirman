/**
 * Custom error response class that extends Error
 * Used to create standardized error responses with status codes
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse; 