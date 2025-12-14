const crypto = require('crypto');

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @param {string} secret - Razorpay key secret
 * @returns {boolean} - True if signature is valid
 */
exports.verifySignature = (orderId, paymentId, signature, secret) => {
  try {
    const sign = orderId + '|' + paymentId;
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    return signature === expectedSign;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Verify webhook signature
 * @param {string} body - Request body as string
 * @param {string} signature - Webhook signature from headers
 * @param {string} secret - Webhook secret
 * @returns {boolean} - True if signature is valid
 */
exports.verifyWebhookSignature = (body, signature, secret) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};

/**
 * Convert amount to paise (smallest currency unit)
 * @param {number} amount - Amount in rupees
 * @returns {number} - Amount in paise
 */
exports.toPaise = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Convert amount from paise to rupees
 * @param {number} paise - Amount in paise
 * @returns {number} - Amount in rupees
 */
exports.toRupees = (paise) => {
  return paise / 100;
};

/**
 * Generate receipt ID
 * @param {string} prefix - Prefix for receipt
 * @returns {string} - Receipt ID
 */
exports.generateReceiptId = (prefix = 'receipt') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Format payment error message
 * @param {object} error - Razorpay error object
 * @returns {string} - Formatted error message
 */
exports.formatPaymentError = (error) => {
  if (error.error && error.error.description) {
    return error.error.description;
  }
  if (error.message) {
    return error.message;
  }
  return 'Payment processing failed. Please try again.';
};

/**
 * Validate payment amount
 * @param {number} amount - Amount to validate
 * @param {number} minAmount - Minimum allowed amount
 * @param {number} maxAmount - Maximum allowed amount
 * @returns {object} - Validation result
 */
exports.validateAmount = (amount, minAmount = 100, maxAmount = 10000000) => {
  if (!amount || isNaN(amount)) {
    return {
      valid: false,
      message: 'Invalid amount'
    };
  }

  if (amount < minAmount) {
    return {
      valid: false,
      message: `Minimum amount is ₹${minAmount}`
    };
  }

  if (amount > maxAmount) {
    return {
      valid: false,
      message: `Maximum amount is ₹${maxAmount}`
    };
  }

  return {
    valid: true,
    message: 'Amount is valid'
  };
};

/**
 * Get payment status color for UI
 * @param {string} status - Payment status
 * @returns {string} - Color code
 */
exports.getStatusColor = (status) => {
  const colors = {
    'created': '#FFA500',
    'authorized': '#00BFFF',
    'captured': '#28A745',
    'refunded': '#6C757D',
    'failed': '#DC3545'
  };
  return colors[status] || '#6C757D';
};

/**
 * Parse Razorpay error
 * @param {object} error - Error object
 * @returns {object} - Parsed error
 */
exports.parseRazorpayError = (error) => {
  return {
    code: error.error?.code || 'UNKNOWN_ERROR',
    description: error.error?.description || error.message || 'An error occurred',
    field: error.error?.field || null,
    source: error.error?.source || 'razorpay',
    step: error.error?.step || null,
    reason: error.error?.reason || null
  };
};
