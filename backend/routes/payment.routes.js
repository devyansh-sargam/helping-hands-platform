const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createOrder,
  verifyPayment,
  paymentFailure,
  getPaymentDetails,
  refundPayment,
  webhookHandler,
  getAllRefunds
} = require('../controllers/payment.controller');

// Validation rules
const createOrderValidation = [
  body('amount').isNumeric().isInt({ min: 100 }).withMessage('Minimum amount is ₹100'),
  body('currency').optional().isIn(['INR', 'USD']).withMessage('Invalid currency')
];

const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
  body('donationData').notEmpty().withMessage('Donation data is required'),
  body('donationData.amount').isNumeric().withMessage('Amount is required'),
  body('donationData.donorName').notEmpty().withMessage('Donor name is required'),
  body('donationData.donorEmail').isEmail().withMessage('Valid email is required')
];

const refundValidation = [
  body('paymentId').notEmpty().withMessage('Payment ID is required')
];

// Public routes
router.post('/create-order', createOrderValidation, validate, createOrder);
router.post('/verify', verifyPaymentValidation, validate, verifyPayment);
router.post('/failure', paymentFailure);
router.post('/webhook', webhookHandler);

// Protected routes
router.get('/:paymentId', protect, getPaymentDetails);

// Admin routes
router.post('/refund', protect, authorize('admin'), refundValidation, validate, refundPayment);
router.get('/refunds/all', protect, authorize('admin'), getAllRefunds);

module.exports = router;
