#!/bin/bash

# Helping Hands - Repository Consolidation Script
# This script copies files from old repositories to the unified repository

echo "🚀 Starting repository consolidation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create temporary directory
TEMP_DIR="temp_repos"
mkdir -p $TEMP_DIR

echo "${BLUE}📥 Step 1: Cloning repositories...${NC}"

# Clone frontend repository
echo "Cloning frontend repository..."
git clone https://github.com/devyansh-sargam/helping-hands-donation.git $TEMP_DIR/frontend
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Frontend cloned successfully${NC}"
else
    echo "${RED}❌ Failed to clone frontend${NC}"
    exit 1
fi

# Clone backend repository
echo "Cloning backend repository..."
git clone https://github.com/devyansh-sargam/helping-hands-backend.git $TEMP_DIR/backend
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Backend cloned successfully${NC}"
else
    echo "${RED}❌ Failed to clone backend${NC}"
    exit 1
fi

echo ""
echo "${BLUE}📋 Step 2: Creating directory structure...${NC}"

# Create frontend directory
mkdir -p frontend
echo "${GREEN}✅ Frontend directory created${NC}"

# Create backend directories
mkdir -p backend/{models,controllers,routes,middleware,utils}
echo "${GREEN}✅ Backend directories created${NC}"

echo ""
echo "${BLUE}📂 Step 3: Copying frontend files...${NC}"

# Copy frontend index.html
cp $TEMP_DIR/frontend/index.html frontend/
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Copied index.html${NC}"
else
    echo "${RED}❌ Failed to copy index.html${NC}"
fi

echo ""
echo "${BLUE}📂 Step 4: Copying backend files...${NC}"

# Copy root backend files
echo "Copying root files..."
cp $TEMP_DIR/backend/server.js backend/ 2>/dev/null && echo "${GREEN}✅ Copied server.js${NC}"
cp $TEMP_DIR/backend/.env.example backend/ 2>/dev/null && echo "${GREEN}✅ Copied .env.example${NC}"
cp $TEMP_DIR/backend/.gitignore backend/ 2>/dev/null && echo "${GREEN}✅ Copied .gitignore${NC}"
cp $TEMP_DIR/backend/railway.json backend/ 2>/dev/null && echo "${GREEN}✅ Copied railway.json${NC}"
cp $TEMP_DIR/backend/render.yaml backend/ 2>/dev/null && echo "${GREEN}✅ Copied render.yaml${NC}"
cp $TEMP_DIR/backend/API_DOCUMENTATION.md backend/ 2>/dev/null && echo "${GREEN}✅ Copied API_DOCUMENTATION.md${NC}"

# Copy models
echo ""
echo "Copying models..."
cp $TEMP_DIR/backend/models/*.js backend/models/ 2>/dev/null
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Copied all models${NC}"
else
    echo "${RED}⚠️  No models found or error copying${NC}"
fi

# Copy controllers
echo ""
echo "Copying controllers..."
cp $TEMP_DIR/backend/controllers/auth.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied auth.controller.js${NC}"
cp $TEMP_DIR/backend/controllers/user.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied user.controller.js${NC}"
cp $TEMP_DIR/backend/controllers/donation.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied donation.controller.js${NC}"
cp $TEMP_DIR/backend/controllers/request.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied request.controller.js${NC}"
cp $TEMP_DIR/backend/controllers/stats.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied stats.controller.js${NC}"
cp $TEMP_DIR/backend/controllers/password.controller.js backend/controllers/ 2>/dev/null && echo "${GREEN}✅ Copied password.controller.js${NC}"

# Copy routes
echo ""
echo "Copying routes..."
cp $TEMP_DIR/backend/routes/auth.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied auth.routes.js${NC}"
cp $TEMP_DIR/backend/routes/user.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied user.routes.js${NC}"
cp $TEMP_DIR/backend/routes/donation.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied donation.routes.js${NC}"
cp $TEMP_DIR/backend/routes/request.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied request.routes.js${NC}"
cp $TEMP_DIR/backend/routes/stats.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied stats.routes.js${NC}"
cp $TEMP_DIR/backend/routes/password.routes.js backend/routes/ 2>/dev/null && echo "${GREEN}✅ Copied password.routes.js${NC}"

# Copy middleware
echo ""
echo "Copying middleware..."
cp $TEMP_DIR/backend/middleware/*.js backend/middleware/ 2>/dev/null
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Copied all middleware${NC}"
else
    echo "${RED}⚠️  No middleware found or error copying${NC}"
fi

# Copy utils
echo ""
echo "Copying utils..."
cp $TEMP_DIR/backend/utils/sendEmail.js backend/utils/ 2>/dev/null && echo "${GREEN}✅ Copied sendEmail.js${NC}"
cp $TEMP_DIR/backend/utils/emailTemplates.js backend/utils/ 2>/dev/null && echo "${GREEN}✅ Copied emailTemplates.js${NC}"
cp $TEMP_DIR/backend/utils/tokenGenerator.js backend/utils/ 2>/dev/null && echo "${GREEN}✅ Copied tokenGenerator.js${NC}"

echo ""
echo "${BLUE}🧹 Step 5: Cleaning up...${NC}"

# Remove temporary directory
rm -rf $TEMP_DIR
echo "${GREEN}✅ Temporary files cleaned${NC}"

echo ""
echo "${GREEN}🎉 Repository consolidation complete!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Frontend files copied to: frontend/"
echo "  - Backend files copied to: backend/"
echo ""
echo "📝 Next steps:"
echo "  1. Review copied files"
echo "  2. Update API URLs in frontend/index.html"
echo "  3. Create backend/.env from backend/.env.example"
echo "  4. Commit and push changes:"
echo "     git add ."
echo "     git commit -m 'Combine frontend and backend into single repository'"
echo "     git push origin main"
echo "  5. Delete old repositories (helping-hands-donation, helping-hands-backend)"
echo ""
echo "✨ Happy coding!"
