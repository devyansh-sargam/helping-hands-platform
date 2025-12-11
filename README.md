# 🤝 Helping Hands - Complete Donation Platform

A full-stack web application connecting generous donors with people in need. Built with modern technologies and best practices.

## 🌟 Features

### Frontend
- ✨ **Modern Dark UI** - Beautiful dark mode with gradient animations
- 💳 **Payment Gateway** - Multiple payment methods (Card, UPI, Net Banking, Wallet)
- 🔐 **Authentication** - Complete login/signup with JWT
- 📊 **Real-time Stats** - Live donation tracking and progress bars
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Advanced Animations** - Smooth transitions and effects

### Backend
- 🔒 **Secure API** - JWT authentication with role-based access
- 💾 **MongoDB Database** - Scalable NoSQL database
- 📧 **Email System** - Automated notifications and receipts
- 🛡️ **Security** - Helmet, rate limiting, XSS protection
- 📈 **Analytics** - Comprehensive statistics and reporting
- ✅ **Validation** - Input validation and sanitization

## 🚀 Live Demo

- **Frontend**: https://devyansh-sargam.github.io/helping-hands-donation/
- **Backend API**: Deploy to Railway/Render (instructions below)

## 📁 Project Structure

```
helping-hands-platform/
├── frontend/              # React/HTML frontend
│   ├── index.html        # Main application file
│   └── assets/           # Images, styles, etc.
├── backend/              # Node.js/Express backend
│   ├── server.js         # Entry point
│   ├── models/           # Database models
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive Design
- LocalStorage for state management

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer for emails
- Bcrypt for password hashing

### Security
- Helmet.js
- Express Rate Limit
- XSS Clean
- Mongo Sanitize
- CORS

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/devyansh-sargam/helping-hands-platform.git
cd helping-hands-platform/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=https://devyansh-sargam.github.io/helping-hands-donation
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

The frontend is already deployed to GitHub Pages. To modify:

1. Edit `frontend/index.html`
2. Update API endpoints to point to your backend
3. Deploy to GitHub Pages or any static hosting

## 🚀 Deployment

### Backend Deployment (Railway)

1. Create account on [Railway](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `backend` folder as root
5. Add environment variables
6. Deploy!

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add environment variables
8. Deploy!

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string
6. Add to `.env` as `MONGODB_URI`

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Use in `.env`:
   - `SMTP_USER`: your-email@gmail.com
   - `SMTP_PASSWORD`: your-app-password

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get single donation
- `GET /api/donations/my/donations` - Get my donations

### Requests
- `POST /api/requests` - Create help request
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id/approve` - Approve request (Admin)
- `PUT /api/requests/:id/reject` - Reject request (Admin)

### Statistics
- `GET /api/stats/overall` - Overall statistics
- `GET /api/stats/donations` - Donation statistics
- `GET /api/stats/requests` - Request statistics
- `GET /api/stats/users` - User statistics

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with 10 salt rounds
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - Express-validator
- **XSS Protection** - Sanitize user input
- **NoSQL Injection Prevention** - Mongo sanitize
- **CORS** - Configured for specific origins
- **Helmet** - Security headers

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (user/admin),
  totalDonations: Number,
  totalDonated: Number,
  timestamps: true
}
```

### Donation Model
```javascript
{
  user: ObjectId,
  request: ObjectId,
  amount: Number,
  cause: String,
  paymentMethod: String,
  transactionId: String,
  status: String,
  isMonthly: Boolean,
  timestamps: true
}
```

### Request Model
```javascript
{
  user: ObjectId,
  title: String,
  category: String,
  description: String,
  amountNeeded: Number,
  amountRaised: Number,
  status: String,
  urgency: String,
  location: Object,
  timestamps: true
}
```

## 📧 Email Templates

- Welcome Email
- Donation Receipt
- Request Submission Confirmation
- Request Approval Notification
- Password Reset
- Email Verification
- Monthly Donation Reminder

## 🧪 Testing

```bash
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment mode | Yes |
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT secret key | Yes |
| JWT_EXPIRE | JWT expiration time | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| SMTP_HOST | Email server host | Yes |
| SMTP_PORT | Email server port | Yes |
| SMTP_USER | Email username | Yes |
| SMTP_PASSWORD | Email password | Yes |

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Devyansh Sargam** - [GitHub](https://github.com/devyansh-sargam)
- Helping Hands Team

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Nodemailer for email service
- All contributors and supporters

## 📞 Support

For support:
- Email: support@helpinghands.org
- Create an issue in the repository
- Check documentation in `/docs` folder

## 🎯 Roadmap

- [x] Phase 1: Backend Foundation
- [x] Phase 2: Authentication & Security
- [ ] Phase 3: Payment Gateway Integration (Razorpay)
- [ ] Phase 4: File Upload System
- [ ] Phase 5: Admin Dashboard
- [ ] Phase 6: Mobile App (React Native)
- [ ] Phase 7: Analytics Dashboard
- [ ] Phase 8: Social Media Integration

## 📈 Stats

- **Total Lines of Code**: 5000+
- **API Endpoints**: 30+
- **Email Templates**: 7
- **Security Features**: 8+
- **Database Models**: 3

---

Made with ❤️ by Helping Hands Team
