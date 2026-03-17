#!/bin/bash
# ============================================================
# setup.sh — Portfolio MERN Stack Project Scaffolder
# ============================================================
# Run this script ONCE from any empty directory.
# It creates the entire project structure and drops every
# file into the correct location ready for npm install.
#
# USAGE:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================================

set -e  # Exit immediately if any command fails

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   Portfolio MERN — Project Setup     ║"
echo "╚══════════════════════════════════════╝"
echo ""

PROJECT_NAME="portfolio-mern"

# ── Step 1: Create root directory ────────────────────────
echo "► Creating project structure..."
mkdir -p $PROJECT_NAME

cd $PROJECT_NAME

# ── Step 2: Create all directories ───────────────────────
# Server directories
mkdir -p server/config
mkdir -p server/models
mkdir -p server/routes
mkdir -p server/middleware
mkdir -p server/controllers
mkdir -p server/utils

# Client directories
mkdir -p client/src/components/loading
mkdir -p client/src/components/sections
mkdir -p client/src/components/Layout
mkdir -p client/src/components/ui
mkdir -p client/src/context
mkdir -p client/src/hooks
mkdir -p client/src/services
mkdir -p client/src/styles
mkdir -p client/src/utils
mkdir -p client/public

echo "✓ Directory tree created"

# ── Step 3: Create .gitignore ─────────────────────────────
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment files — NEVER commit these
server/.env
client/.env

# Build output
client/dist/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
EOF

echo "✓ .gitignore created"

# ── Step 4: Create server .env files ──────────────────────
cat > server/.env.example << 'EOF'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/portfolio
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=where_you_receive_mail@gmail.com
JWT_SECRET=replace_this_with_a_long_random_secret
EOF

# Copy example to actual .env so server starts immediately
cp server/.env.example server/.env
echo "✓ server/.env created (fill in your values)"

# ── Step 5: Create placeholder files ──────────────────────
# Placeholder for any files you'll add content to manually
# (This script creates the structure; you paste the code)

touch server/config/db.js
touch server/models/GrindPost.js
touch server/models/Project.js
touch server/models/Skill.js
touch server/middleware/errorHandler.js
touch server/controllers/grindController.js
touch server/controllers/projectController.js
touch server/controllers/contactController.js
touch server/routes/grindRoutes.js
touch server/routes/projectRoutes.js
touch server/routes/contactRoutes.js
touch server/server.js

touch client/index.html
touch client/vite.config.js
touch client/src/main.jsx
touch client/src/App.jsx
touch client/src/context/AppContext.jsx
touch client/src/services/api.js
touch client/src/hooks/useIntersection.js
touch client/src/hooks/useGrindPosts.js
touch client/src/styles/globals.css
touch client/src/styles/animations.css
touch client/src/components/loading/NeuralLoader.jsx
touch client/src/components/loading/NeuralLoader.css
touch client/src/components/sections/Hero.jsx
touch client/src/components/sections/Hero.css
touch client/src/components/sections/TheGrind.jsx
touch client/src/components/sections/TheGrind.css
touch client/src/components/sections/Projects.jsx
touch client/src/components/sections/Projects.css
touch client/src/components/sections/SkillsMatrix.jsx
touch client/src/components/sections/SkillsMatrix.css
touch client/src/components/sections/Contact.jsx
touch client/src/components/sections/Contact.css
touch client/src/components/Layout/Navbar.jsx
touch client/src/components/Layout/Navbar.css

echo "✓ All source files created"

# ── Step 6: Install dependencies ──────────────────────────
echo ""
echo "► Installing server dependencies..."
cd server
npm install express mongoose dotenv cors helmet morgan \
            express-rate-limit nodemailer
npm install --save-dev nodemon
cd ..

echo ""
echo "► Installing client dependencies..."
cd client
npm install react react-dom react-router-dom axios react-markdown
npm install --save-dev vite @vitejs/plugin-react
cd ..

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   ✅  Setup Complete!                            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "NEXT STEPS:"
echo ""
echo "  1. Paste all the code from the tutorial into"
echo "     the corresponding files created above."
echo ""
echo "  2. Fill in server/.env with your MongoDB URI"
echo "     and email credentials."
echo ""
echo "  3. Start the backend:"
echo "       cd server && npm run dev"
echo ""
echo "  4. In a new terminal, start the frontend:"
echo "       cd client && npm run dev"
echo ""
echo "  5. Open http://localhost:5173"
echo ""
echo "  To seed your first Grind post, POST to:"
echo "  http://localhost:5000/api/grind"
echo "  with body: { dayNumber: 1, title: '...', content: '...' }"
echo ""