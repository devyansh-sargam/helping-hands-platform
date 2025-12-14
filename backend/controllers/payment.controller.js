const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation.model');
const Request = require('../models/Request.model');
const User = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');
const { donationReceiptEmail } = require('../utils/emailTemplates');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum amount is ₹100'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    next(error);
  }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationData
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Payment verified - Create donation record
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = await Donation.create({
      user: req.user ? req.user.id : null,
      request: donationData.requestId || null,
      amount: donationData.amount,
      cause: donationData.cause,
      paymentMethod: donationData.paymentMethod,
      paymentInfo: donationData.paymentInfo,
      transactionId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'completed',
      isMonthly: donationData.isMonthly || false,
      donorName: donationData.donorName,
      donorEmail: donationData.donorEmail,
      notes: donationData.notes
    });

    // Update request if donation is for a specific request
    if (donationData.requestId) {
      await Request.findByIdAndUpdate(donationData.requestId, {
        $inc: { amountRaised: donationData.amount, donorsCount: 1 },
        $push: { donations: donation._id }
      });
    }

    // Update user stats if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalDonations: 1, totalDonated: donationData.amount }
      });
    }

    // Send donation receipt email
    const emailHtml = donationReceiptEmail(
      donationData.donorName,
      donationData.amount,
      donationData.cause,
      transactionId,
      new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );

    await sendEmail({
      email: donationData.donorEmail,
      subject: 'Donation Receipt - Helping Hands',
      html: emailHtml
    });

    // Mark receipt as sent
    donation.receiptSent = true;
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and donation recorded successfully',
      data: {
        donation: {
          id: donation._id,
          transactionId: donation.transactionId,
          amount: donation.amount,
          status: donation.status,
          receiptSent: donation.receiptSent
        }
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Public
exports.paymentFailure = async (req, res, next) => {
  try {
    const { razorpay_order_id, error } = req.body;

    // Log the failure
    console.error('Payment failed:', {
      orderId: razorpay_order_id,
      error: error
    });

    res.status(200).json({
      success: false,
      message: 'Payment failed. Please try again.',
      error: error
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Fetch payment error:', error);
    next(error);
  }
};

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentId, amount, notes } = req.body;

    // Create refund
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined, // Partial or full refund
      notes: notes || {}
    });

    // Update donation status
    const donation = await Donation.findOne({ razorpayPaymentId: paymentId });
    if (donation) {
      donation.status = 'refunded';
      await donation.save();

      // Update request if applicable
      if (donation.request) {
        await Request.findByIdAndUpdate(donation.request, {
          $inc: { amountRaised: -donation.amount, donorsCount: -1 }
        });
      }

      // Update user stats
      if (donation.user) {
        await User.findByIdAndUpdate(donation.user, {
          $inc: { totalDonations: -1, totalDonated: -donation.amount }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    next(error);
  }
};

// @desc    Webhook handler for Razorpay events
// @route   POST /api/payments/webhook
// @access  Public (but verified)
exports.webhookHandler = async (req, res, next) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', payload.payment.entity.id);
        // Additional processing if needed
        break;

      case 'payment.failed':
        console.log('Payment failed:', payload.payment.entity.id);
        // Update donation status to failed
        const failedDonation = await Donation.findOne({
          razorpayPaymentId: payload.payment.entity.id
        });
        if (failedDonation) {
          failedDonation.status = 'failed';
          await failedDonation.save();
        }
        break;

      case 'refund.created':
        console.log('Refund created:', payload.refund.entity.id);
        break;

      default:
        console.log('Unhandled event:', event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};

// @desc    Get all refunds
// @route   GET /api/payments/refunds
// @access  Private/Admin
exports.getAllRefunds = async (req, res, next) => {
  try {
    const { from, to, count = 10, skip = 0 } = req.query;

    const options = {
      count: parseInt(count),
      skip: parseInt(skip)
    };

    if (from) options.from = new Date(from).getTime() / 1000;
    if (to) options.to = new Date(to).getTime() / 1000;

    const refunds = await razorpay.refunds.all(options);

    res.status(200).json({
      success: true,
      count: refunds.items.length,
      data: refunds.items
    });
  } catch (error) {
    console.error('Fetch refunds error:', error);
    next(error);
  }
};
