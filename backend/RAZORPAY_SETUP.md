# 💳 Razorpay Integration Setup Guide

Complete guide to set up Razorpay payment gateway for Helping Hands platform.

## 📋 Prerequisites

- Razorpay account (free to create)
- PAN card (for Indian businesses)
- Bank account details
- Business details

## 🚀 Quick Setup (10 Minutes)

### Step 1: Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Sign up with email
3. Verify email address
4. Complete KYC (for live mode)

### Step 2: Get API Keys

#### Test Mode (For Development)
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Click "Generate Test Key"
4. Copy **Key ID** and **Key Secret**

#### Live Mode (For Production)
1. Complete KYC verification
2. Activate your account
3. Go to Settings → API Keys
4. Click "Generate Live Key"
5. Copy **Key ID** and **Key Secret**

### Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Use test keys for development
# Use live keys for production
```

### Step 4: Set Up Webhooks

1. Go to Settings → Webhooks
2. Click "Create New Webhook"
3. Enter webhook URL:
   ```
   https://your-backend-url.com/api/payments/webhook
   ```
4. Select events to listen:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ refund.created
   - ✅ refund.processed
5. Copy the **Webhook Secret**
6. Add to `.env` as `RAZORPAY_WEBHOOK_SECRET`

## 🔧 Integration Steps

### Backend Integration (Already Done ✅)

The following files have been created:
- `controllers/payment.controller.js` - Payment logic
- `routes/payment.routes.js` - Payment endpoints
- `utils/razorpayHelper.js` - Helper functions

### Frontend Integration

Add Razorpay checkout script to your HTML:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Example payment flow:

```javascript
// 1. Create order on backend
const createOrder = async (amount) => {
  const response = await fetch('https://your-api.com/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  return response.json();
};

// 2. Open Razorpay checkout
const initiatePayment = async (donationData) => {
  const orderData = await createOrder(donationData.amount);
  
  const options = {
    key: orderData.data.keyId,
    amount: orderData.data.amount,
    currency: orderData.data.currency,
    name: 'Helping Hands',
    description: 'Donation',
    order_id: orderData.data.orderId,
    handler: async function (response) {
      // 3. Verify payment on backend
      const verifyResponse = await fetch('https://your-api.com/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          donationData: donationData
        })
      });
      
      const result = await verifyResponse.json();
      if (result.success) {
        alert('Payment successful! Receipt sent to your email.');
      }
    },
    prefill: {
      name: donationData.donorName,
      email: donationData.donorEmail,
      contact: donationData.phone
    },
    theme: {
      color: '#6366f1'
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
};
```

## 📡 API Endpoints

### Create Order
```
POST /api/payments/create-order
```
**Request:**
```json
{
  "amount": 5000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {
    "cause": "medical"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxxxx",
    "amount": 500000,
    "currency": "INR",
    "keyId": "rzp_test_xxxxx"
  }
}
```

### Verify Payment
```
POST /api/payments/verify
```
**Request:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "donationData": {
    "amount": 5000,
    "cause": "medical",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "paymentMethod": "card"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "donation": {
      "id": "64abc123",
      "transactionId": "TXN123456",
      "amount": 5000,
      "status": "completed"
    }
  }
}
```

### Refund Payment (Admin)
```
POST /api/payments/refund
Authorization: Bearer <admin_token>
```
**Request:**
```json
{
  "paymentId": "pay_xxxxx",
  "amount": 5000,
  "notes": {
    "reason": "Requested by donor"
  }
}
```

## 🧪 Testing

### Test Cards

Razorpay provides test cards for development:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

**3D Secure:**
- Card: 5104 0600 0000 0008
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: 1234

### Test UPI IDs
- success@razorpay
- failure@razorpay

### Test Wallets
All wallets work in test mode with automatic success/failure

## 🔒 Security Best Practices

1. **Never expose Key Secret**
   - Keep in `.env` file
   - Never commit to Git
   - Use environment variables

2. **Always verify signatures**
   - Verify payment signature on backend
   - Verify webhook signature
   - Don't trust client-side data

3. **Use HTTPS**
   - All payment endpoints must use HTTPS
   - Razorpay requires SSL certificate

4. **Validate amounts**
   - Validate on both frontend and backend
   - Check minimum/maximum limits
   - Prevent amount manipulation

5. **Log everything**
   - Log all payment attempts
   - Log webhook events
   - Monitor for suspicious activity

## 💰 Pricing

### Transaction Fees (India)

- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 0% (free)
- **Net Banking**: 2% + GST
- **Wallets**: 2% + GST

### Settlement

- **Standard**: T+3 days (free)
- **Instant**: T+0 (additional 0.25%)

## 📊 Dashboard Features

1. **Payments**: View all transactions
2. **Refunds**: Process refunds
3. **Settlements**: Track payouts
4. **Analytics**: Revenue reports
5. **Customers**: Manage customer data
6. **Invoices**: Generate invoices

## 🔔 Webhook Events

The platform listens to these events:

- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `refund.created` - Refund initiated
- `refund.processed` - Refund completed

## 🐛 Troubleshooting

### Payment fails immediately
- Check API keys are correct
- Verify test/live mode matches
- Check amount is >= ₹100

### Signature verification fails
- Ensure Key Secret is correct
- Check signature generation logic
- Verify order_id and payment_id

### Webhook not receiving events
- Check webhook URL is accessible
- Verify HTTPS is enabled
- Check webhook secret matches

### Refund fails
- Verify payment was captured
- Check refund amount <= payment amount
- Ensure sufficient balance

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Support Email**: support@razorpay.com
- **Dashboard**: https://dashboard.razorpay.com/
- **Status Page**: https://status.razorpay.com/

## ✅ Checklist

Before going live:

- [ ] Complete KYC verification
- [ ] Switch to live API keys
- [ ] Update webhook URL to production
- [ ] Test all payment methods
- [ ] Test refund flow
- [ ] Set up settlement account
- [ ] Configure email notifications
- [ ] Test webhook events
- [ ] Review security settings
- [ ] Enable 2FA on Razorpay account

---

**Ready to accept payments!** 💳✨

For questions, check the [Razorpay Documentation](https://razorpay.com/docs/) or contact support.
