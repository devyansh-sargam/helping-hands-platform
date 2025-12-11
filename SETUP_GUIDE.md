# 🚀 Complete Setup Guide - Helping Hands Platform

This guide will walk you through setting up the complete Helping Hands donation platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js >= 18.0.0 installed
- Git installed
- A MongoDB Atlas account (free tier available)
- A Gmail account (for sending emails)
- A code editor (VS Code recommended)

## 🎯 Quick Start (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/devyansh-sargam/helping-hands-platform.git
cd helping-hands-platform
```

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `helping-hands`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/helping-hands?retryWrites=true&w=majority
```

### Step 3: Set Up Gmail for Emails

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Step 4: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000

# Paste your MongoDB connection string here
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/helping-hands?retryWrites=true&w=majority

# Generate a random secret (or use: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

JWT_EXPIRE=7d
FRONTEND_URL=https://devyansh-sargam.github.io/helping-hands-donation

# Gmail SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### Step 5: Install Dependencies & Start Backend

```bash
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
📡 Health check: http://localhost:5000/health
```

### Step 6: Test the API

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🎨 Frontend Setup

The frontend is already deployed at:
https://devyansh-sargam.github.io/helping-hands-donation/

To modify the frontend:
1. Edit `frontend/index.html`
2. Update API endpoints to point to your backend
3. Deploy to GitHub Pages or any static hosting

## 🧪 Testing the Complete Flow

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response.

### 3. Create a Donation

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "cause": "medical",
    "paymentMethod": "upi",
    "paymentInfo": "test@upi",
    "donorName": "Test User",
    "donorEmail": "test@example.com",
    "isMonthly": false
  }'
```

### 4. Get Statistics

```bash
curl http://localhost:5000/api/stats/overall
```

## 🚀 Deployment

### Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `helping-hands-platform`
5. Set root directory to `backend`
6. Add environment variables from `.env`
7. Click "Deploy"

Railway will provide you with a URL like:
```
https://helping-hands-backend-production.up.railway.app
```

### Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `helping-hands-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add environment variables
7. Click "Create Web Service"

### Update Frontend

Once backend is deployed, update the frontend:
1. Edit `frontend/index.html`
2. Replace all `http://localhost:5000` with your deployed backend URL
3. Commit and push to GitHub
4. Frontend will auto-deploy to GitHub Pages

## 📧 Email Templates

The platform sends emails for:
- ✅ Welcome email on registration
- 💰 Donation receipt
- 📝 Request submission confirmation
- ✅ Request approval notification
- 🔐 Password reset
- 📧 Email verification
- 🔄 Monthly donation reminders

All templates are in `backend/utils/emailTemplates.js`

## 🔒 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS (automatic on Railway/Render)
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to your production domain
- [ ] Review and update CORS settings
- [ ] Set up MongoDB IP whitelist (or use 0.0.0.0/0 for all)
- [ ] Enable MongoDB authentication
- [ ] Set up backup strategy for database
- [ ] Configure error monitoring (Sentry recommended)

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: ...
```
**Solution**: Check your connection string, ensure IP is whitelisted, verify credentials

### Email Not Sending
```
Email error: ...
```
**Solution**: Verify Gmail app password, check SMTP settings, ensure 2FA is enabled

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using port 5000

### JWT Token Invalid
```
Invalid or expired token
```
**Solution**: Login again to get a new token, check JWT_SECRET matches

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/) - Debug JWT tokens
- [Nodemailer Documentation](https://nodemailer.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the API documentation in `API_DOCUMENTATION.md`
3. Check server logs for error messages
4. Create an issue on GitHub
5. Email: support@helpinghands.org

## 🎉 Success!

If everything is working:
- ✅ Backend running on http://localhost:5000
- ✅ MongoDB connected
- ✅ Emails sending successfully
- ✅ API endpoints responding
- ✅ Frontend connected to backend

You're ready to start making a difference! 🤝

---

**Next Steps:**
- Customize email templates
- Add more payment gateways (Razorpay/Stripe)
- Implement file upload for verification documents
- Build admin dashboard
- Add analytics and reporting
- Set up monitoring and alerts

Happy coding! 💻✨
