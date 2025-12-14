# 📁 Complete Repository Structure

This document outlines the complete structure of the Helping Hands platform repository.

## 🗂️ Repository Structure

```
helping-hands-platform/
├── README.md                           # Main documentation
├── SETUP_GUIDE.md                      # Setup instructions
├── MIGRATION_COMPLETE.md               # Migration notes
├── PHASE_3_COMPLETE.md                 # Phase 3 summary
├── COMPLETE_STRUCTURE.md               # This file
│
├── frontend/                           # Frontend application
│   ├── index.html                      # Main HTML file (COPY FROM helping-hands-donation repo)
│   ├── payment-integration.js          # Razorpay integration ✅
│   ├── assets/                         # Images, icons, etc.
│   └── README.md                       # Frontend documentation
│
└── backend/                            # Backend API
    ├── package.json                    # Dependencies ✅
    ├── server.js                       # Main server file (NEEDS TO BE COPIED)
    ├── .env.example                    # Environment template (NEEDS TO BE COPIED)
    ├── .gitignore                      # Git ignore (NEEDS TO BE COPIED)
    ├── railway.json                    # Railway config (NEEDS TO BE COPIED)
    ├── render.yaml                     # Render config (NEEDS TO BE COPIED)
    ├── API_DOCUMENTATION.md            # API docs (NEEDS TO BE COPIED)
    ├── RAZORPAY_SETUP.md               # Razorpay guide ✅
    │
    ├── models/                         # Database models (NEEDS TO BE COPIED)
    │   ├── User.model.js
    │   ├── Donation.model.js
    │   └── Request.model.js
    │
    ├── controllers/                    # Route controllers
    │   ├── auth.controller.js          # (NEEDS TO BE COPIED)
    │   ├── user.controller.js          # (NEEDS TO BE COPIED)
    │   ├── donation.controller.js      # (NEEDS TO BE COPIED)
    │   ├── request.controller.js       # (NEEDS TO BE COPIED)
    │   ├── stats.controller.js         # (NEEDS TO BE COPIED)
    │   ├── password.controller.js      # (NEEDS TO BE COPIED)
    │   └── payment.controller.js       # ✅ Already added
    │
    ├── routes/                         # API routes
    │   ├── auth.routes.js              # (NEEDS TO BE COPIED)
    │   ├── user.routes.js              # (NEEDS TO BE COPIED)
    │   ├── donation.routes.js          # (NEEDS TO BE COPIED)
    │   ├── request.routes.js           # (NEEDS TO BE COPIED)
    │   ├── stats.routes.js             # (NEEDS TO BE COPIED)
    │   ├── password.routes.js          # (NEEDS TO BE COPIED)
    │   └── payment.routes.js           # ✅ Already added
    │
    ├── middleware/                     # Custom middleware (NEEDS TO BE COPIED)
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── validation.middleware.js
    │
    └── utils/                          # Utility functions
        ├── sendEmail.js                # (NEEDS TO BE COPIED)
        ├── emailTemplates.js           # (NEEDS TO BE COPIED)
        ├── tokenGenerator.js           # (NEEDS TO BE COPIED)
        └── razorpayHelper.js           # ✅ Already added
```

## 📋 Files Status

### ✅ Already in Unified Repo
- README.md
- SETUP_GUIDE.md
- MIGRATION_COMPLETE.md
- PHASE_3_COMPLETE.md
- backend/package.json
- backend/controllers/payment.controller.js
- backend/routes/payment.routes.js
- backend/utils/razorpayHelper.js
- backend/RAZORPAY_SETUP.md
- frontend/payment-integration.js

### 📥 Need to Copy from helping-hands-backend

**Root Files:**
- server.js
- .env.example
- .gitignore
- railway.json
- render.yaml
- API_DOCUMENTATION.md

**Models (3 files):**
- models/User.model.js
- models/Donation.model.js
- models/Request.model.js

**Controllers (5 files):**
- controllers/auth.controller.js
- controllers/user.controller.js
- controllers/donation.controller.js
- controllers/request.controller.js
- controllers/stats.controller.js
- controllers/password.controller.js

**Routes (5 files):**
- routes/auth.routes.js
- routes/user.routes.js
- routes/donation.routes.js
- routes/request.routes.js
- routes/stats.routes.js
- routes/password.routes.js

**Middleware (3 files):**
- middleware/auth.middleware.js
- middleware/error.middleware.js
- middleware/validation.middleware.js

**Utils (3 files):**
- utils/sendEmail.js
- utils/emailTemplates.js
- utils/tokenGenerator.js

### 📥 Need to Copy from helping-hands-donation

**Frontend:**
- index.html (Main application file)

## 🚀 Quick Copy Instructions

### Option 1: Manual Copy (Recommended)

1. **Copy Frontend:**
```bash
# Clone the frontend repo
git clone https://github.com/devyansh-sargam/helping-hands-donation.git temp-frontend

# Copy index.html to unified repo
cp temp-frontend/index.html helping-hands-platform/frontend/

# Clean up
rm -rf temp-frontend
```

2. **Copy Backend:**
```bash
# Clone the backend repo
git clone https://github.com/devyansh-sargam/helping-hands-backend.git temp-backend

# Copy all backend files to unified repo
cp -r temp-backend/* helping-hands-platform/backend/

# Clean up
rm -rf temp-backend
```

3. **Commit and Push:**
```bash
cd helping-hands-platform
git add .
git commit -m "Combine frontend and backend into single repository"
git push origin main
```

### Option 2: Download and Upload

1. Download frontend `index.html` from:
   https://github.com/devyansh-sargam/helping-hands-donation/blob/main/index.html

2. Download backend files from:
   https://github.com/devyansh-sargam/helping-hands-backend

3. Upload to unified repo at:
   https://github.com/devyansh-sargam/helping-hands-platform

## 📝 After Copying

### Update Frontend API URLs

Edit `frontend/index.html` and update all API endpoints:

```javascript
// Change from:
const API_URL = 'http://localhost:5000/api';

// To:
const API_URL = 'https://your-backend-url.com/api';
```

### Update Backend Server

Edit `backend/server.js` to include payment routes:

```javascript
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);
```

### Environment Variables

Create `backend/.env` from `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx
```

## 🗑️ After Successful Merge

Delete old repositories:

1. **helping-hands-donation**
   - Go to: https://github.com/devyansh-sargam/helping-hands-donation/settings
   - Scroll to "Danger Zone"
   - Click "Delete this repository"

2. **helping-hands-backend**
   - Go to: https://github.com/devyansh-sargam/helping-hands-backend/settings
   - Scroll to "Danger Zone"
   - Click "Delete this repository"

## ✅ Verification Checklist

After copying all files:

- [ ] Frontend index.html copied
- [ ] All backend models copied (3 files)
- [ ] All backend controllers copied (6 files)
- [ ] All backend routes copied (6 files)
- [ ] All backend middleware copied (3 files)
- [ ] All backend utils copied (4 files)
- [ ] server.js copied and updated
- [ ] .env.example copied
- [ ] .gitignore copied
- [ ] Deployment configs copied
- [ ] API documentation copied
- [ ] All files committed and pushed
- [ ] Old repositories deleted

## 📊 Final Structure

Once complete, you'll have:

```
helping-hands-platform/
├── 📄 Documentation (6 files)
├── 🎨 Frontend (2+ files)
└── ⚙️ Backend (30+ files)
    ├── Models (3)
    ├── Controllers (6)
    ├── Routes (6)
    ├── Middleware (3)
    └── Utils (4)
```

**Total Files**: 40+ files in single repository

## 🎯 Benefits of Unified Repo

✅ Single source of truth
✅ Easier version control
✅ Simplified deployment
✅ Better collaboration
✅ Consistent documentation
✅ Easier to maintain

---

**Next Step**: Copy all files using the instructions above, then delete old repositories.
