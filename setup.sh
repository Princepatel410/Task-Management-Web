#!/bin/bash

echo "🚀 Setting up Task Management Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create environment file
echo "🔧 Creating environment file..."
if [ ! -f "server/.env" ]; then
    cat > server/.env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-management-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ Environment file created at server/.env"
else
    echo "ℹ️  Environment file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB (if using local installation):"
echo "   mongod"
echo ""
echo "2. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "3. Start the frontend development server:"
echo "   npm run dev"
echo ""
echo "4. Open your browser and navigate to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🚀" 