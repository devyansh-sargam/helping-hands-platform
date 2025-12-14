/**
 * Razorpay Payment Integration for Helping Hands
 * 
 * This file contains the complete payment flow integration
 * Add this to your frontend HTML file
 */

// Configuration
const API_BASE_URL = 'https://your-backend-url.com/api'; // Update with your backend URL
const RAZORPAY_KEY_ID = 'rzp_test_xxxxx'; // Will be fetched from backend

/**
 * Initialize payment process
 * @param {Object} donationData - Donation details
 */
async function initiatePayment(donationData) {
  try {
    // Show loading state
    showLoading('Processing payment...');

    // Step 1: Create Razorpay order on backend
    const orderData = await createRazorpayOrder(donationData.amount);

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    // Step 2: Open Razorpay checkout
    openRazorpayCheckout(orderData.data, donationData);

  } catch (error) {
    console.error('Payment initiation error:', error);
    hideLoading();
    showError(error.message || 'Failed to initiate payment');
  }
}

/**
 * Create Razorpay order on backend
 * @param {number} amount - Amount in rupees
 * @returns {Promise<Object>} Order data
 */
async function createRazorpayOrder(amount) {
  const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        platform: 'helping-hands'
      }
    })
  });

  return await response.json();
}

/**
 * Open Razorpay checkout modal
 * @param {Object} orderData - Order details from backend
 * @param {Object} donationData - Donation details
 */
function openRazorpayCheckout(orderData, donationData) {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Helping Hands',
    description: `Donation for ${donationData.cause}`,
    image: 'https://your-logo-url.com/logo.png', // Update with your logo
    order_id: orderData.orderId,
    
    // Payment success handler
    handler: async function (response) {
      await handlePaymentSuccess(response, donationData);
    },
    
    // Prefill donor information
    prefill: {
      name: donationData.donorName,
      email: donationData.donorEmail,
      contact: donationData.phone || ''
    },
    
    // Notes
    notes: {
      cause: donationData.cause,
      isMonthly: donationData.isMonthly || false
    },
    
    // Theme customization
    theme: {
      color: '#6366f1',
      backdrop_color: '#000000'
    },
    
    // Modal options
    modal: {
      ondismiss: function() {
        hideLoading();
        console.log('Payment cancelled by user');
      },
      escape: true,
      animation: true
    },
    
    // Retry options
    retry: {
      enabled: true,
      max_count: 3
    }
  };

  const rzp = new Razorpay(options);
  
  // Handle payment failure
  rzp.on('payment.failed', async function (response) {
    await handlePaymentFailure(response);
  });

  // Open checkout
  rzp.open();
  hideLoading();
}

/**
 * Handle successful payment
 * @param {Object} response - Razorpay response
 * @param {Object} donationData - Donation details
 */
async function handlePaymentSuccess(response, donationData) {
  try {
    showLoading('Verifying payment...');

    // Verify payment on backend
    const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        donationData: donationData
      })
    });

    const result = await verifyResponse.json();

    hideLoading();

    if (result.success) {
      // Show success message
      showSuccessModal({
        transactionId: result.data.donation.transactionId,
        amount: result.data.donation.amount,
        email: donationData.donorEmail
      });

      // Clear form
      clearDonationForm();

      // Update UI stats
      updateDonationStats();

    } else {
      throw new Error(result.message || 'Payment verification failed');
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    hideLoading();
    showError('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
  }
}

/**
 * Handle payment failure
 * @param {Object} response - Razorpay error response
 */
async function handlePaymentFailure(response) {
  console.error('Payment failed:', response.error);

  // Send failure info to backend
  try {
    await fetch(`${API_BASE_URL}/payments/failure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: response.error.metadata?.order_id,
        error: {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason
        }
      })
    });
  } catch (error) {
    console.error('Failed to log payment failure:', error);
  }

  hideLoading();
  
  // Show user-friendly error message
  const errorMessage = getPaymentErrorMessage(response.error.code);
  showError(errorMessage);
}

/**
 * Get user-friendly error message
 * @param {string} errorCode - Razorpay error code
 * @returns {string} User-friendly message
 */
function getPaymentErrorMessage(errorCode) {
  const errorMessages = {
    'BAD_REQUEST_ERROR': 'Invalid payment details. Please try again.',
    'GATEWAY_ERROR': 'Payment gateway error. Please try again later.',
    'SERVER_ERROR': 'Server error. Please try again later.',
    'NETWORK_ERROR': 'Network error. Please check your connection.',
    'PAYMENT_DECLINED': 'Payment declined by bank. Please try another payment method.',
    'INSUFFICIENT_FUNDS': 'Insufficient funds. Please try another payment method.',
    'CARD_EXPIRED': 'Card has expired. Please use another card.',
    'INVALID_CVV': 'Invalid CVV. Please check and try again.',
    'INVALID_CARD': 'Invalid card details. Please check and try again.'
  };

  return errorMessages[errorCode] || 'Payment failed. Please try again or contact support.';
}

/**
 * Show success modal
 * @param {Object} data - Success data
 */
function showSuccessModal(data) {
  const modal = document.createElement('div');
  modal.className = 'success-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Thank you for your generous donation of <strong>₹${data.amount.toLocaleString()}</strong></p>
      <p>Transaction ID: <strong>${data.transactionId}</strong></p>
      <p>A receipt has been sent to <strong>${data.email}</strong></p>
      <button onclick="closeSuccessModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

/**
 * Close success modal
 */
function closeSuccessModal() {
  const modal = document.querySelector('.success-modal');
  if (modal) {
    modal.remove();
  }
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 */
function showLoading(message = 'Processing...') {
  let loader = document.getElementById('payment-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'payment-loader';
    loader.className = 'payment-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(loader);
  } else {
    loader.querySelector('p').textContent = message;
    loader.style.display = 'flex';
  }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const loader = document.getElementById('payment-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  alert(message); // Replace with your custom error modal
}

/**
 * Clear donation form
 */
function clearDonationForm() {
  // Implement based on your form structure
  const form = document.getElementById('donation-form');
  if (form) {
    form.reset();
  }
}

/**
 * Update donation statistics
 */
async function updateDonationStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/overall`);
    const data = await response.json();
    
    if (data.success) {
      // Update stats on page
      document.getElementById('total-raised').textContent = 
        `₹${data.data.totalAmountRaised.toLocaleString()}`;
      document.getElementById('total-donors').textContent = 
        data.data.peopleHelped.toLocaleString();
    }
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

/**
 * Example: Handle donate button click
 */
function handleDonateClick() {
  // Get form data
  const donationData = {
    amount: parseInt(document.getElementById('amount').value),
    cause: document.getElementById('cause').value,
    paymentMethod: 'razorpay',
    donorName: document.getElementById('name').value,
    donorEmail: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    isMonthly: document.getElementById('monthly').checked,
    requestId: document.getElementById('requestId')?.value || null
  };

  // Validate
  if (!donationData.amount || donationData.amount < 100) {
    showError('Minimum donation amount is ₹100');
    return;
  }

  if (!donationData.donorName || !donationData.donorEmail) {
    showError('Please fill in all required fields');
    return;
  }

  // Initiate payment
  initiatePayment(donationData);
}

// Add CSS for modals and loader
const style = document.createElement('style');
style.textContent = `
  .payment-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .loader-content {
    text-align: center;
    color: white;
  }

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .success-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  }

  .modal-content {
    background: white;
    padding: 40px;
    border-radius: 10px;
    text-align: center;
    max-width: 500px;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: #28a745;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    margin: 0 auto 20px;
  }

  .modal-content button {
    margin-top: 20px;
    padding: 12px 30px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .modal-content button:hover {
    background: #4f46e5;
  }
`;
document.head.appendChild(style);

// Export functions for use in HTML
window.initiatePayment = initiatePayment;
window.handleDonateClick = handleDonateClick;
window.closeSuccessModal = closeSuccessModal;
