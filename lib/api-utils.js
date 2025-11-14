/**
 * @fileoverview API utility functions for standardized response handling and validation
 * @author Pisang Ijo Evi
 */

import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export class ApiResponse {
  /**
   * Create success response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} status - HTTP status code
   * @returns {NextResponse}
   */
  static success(data = null, message = 'Success', status = 200) {
    return NextResponse.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    }, { status });
  }

  /**
   * Create error response
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {any} details - Additional error details
   * @returns {NextResponse}
   */
  static error(message = 'Internal Server Error', status = 500, details = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (details && process.env.NODE_ENV === 'development') {
      response.details = details;
    }

    return NextResponse.json(response, { status });
  }

  /**
   * Create validation error response
   * @param {string|Array} errors - Validation errors
   * @returns {NextResponse}
   */
  static validationError(errors) {
    return NextResponse.json({
      success: false,
      message: 'Validation failed',
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }

  /**
   * Create not found response
   * @param {string} resource - Resource that was not found
   * @returns {NextResponse}
   */
  static notFound(resource = 'Resource') {
    return NextResponse.json({
      success: false,
      message: `${resource} not found`,
      timestamp: new Date().toISOString()
    }, { status: 404 });
  }

  /**
   * Create unauthorized response
   * @param {string} message - Unauthorized message
   * @returns {NextResponse}
   */
  static unauthorized(message = 'Unauthorized access') {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }

  /**
   * Create forbidden response
   * @param {string} message - Forbidden message
   * @returns {NextResponse}
   */
  static forbidden(message = 'Forbidden access') {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    }, { status: 403 });
  }
}

/**
 * Error handler for API routes
 * @param {Error} error - Error object
 * @param {string} context - Error context for logging
 * @returns {NextResponse}
 */
export function handleApiError(error, context = 'API') {
  console.error(`${context} Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return ApiResponse.validationError(error.message);
  }

  if (error.name === 'MongoError' || error.code === 11000) {
    if (error.code === 11000) {
      return ApiResponse.error('Duplicate entry found', 409);
    }
    return ApiResponse.error('Database operation failed', 500);
  }

  if (error.message.includes('not found')) {
    return ApiResponse.notFound();
  }

  if (error.message.includes('unauthorized')) {
    return ApiResponse.unauthorized();
  }

  // Default error response
  return ApiResponse.error(
    process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? error.stack : null
  );
}

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - Array of required field names
 * @throws {Error} If validation fails
 */
export function validateRequiredFields(body, requiredFields) {
  const missingFields = [];
  const invalidFields = [];

  requiredFields.forEach(field => {
    if (!(field in body)) {
      missingFields.push(field);
    } else if (body[field] === null || body[field] === undefined || body[field] === '') {
      invalidFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (invalidFields.length > 0) {
    throw new Error(`Invalid values for fields: ${invalidFields.join(', ')}`);
  }
}

/**
 * Sanitize and validate numeric values
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error messages
 * @param {Object} options - Validation options
 * @returns {number} Validated number
 */
export function validateNumber(value, fieldName, options = {}) {
  const { min = 0, max = Infinity, required = true } = options;
  
  if (value === null || value === undefined || value === '') {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return options.default || 0;
  }

  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (numValue < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }

  if (numValue > max) {
    throw new Error(`${fieldName} cannot exceed ${max}`);
  }

  return numValue;
}

/**
 * Sanitize string values
 * @param {any} value - Value to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export function sanitizeString(value, options = {}) {
  const { trim = true, maxLength = null, minLength = 0 } = options;
  
  if (value === null || value === undefined) {
    return '';
  }

  let sanitized = String(value);
  
  if (trim) {
    sanitized = sanitized.trim();
  }

  if (minLength > 0 && sanitized.length < minLength) {
    throw new Error(`String must be at least ${minLength} characters long`);
  }

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Create pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export function createPagination(total, page = 1, limit = 10) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
}