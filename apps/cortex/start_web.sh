#!/bin/bash
# Cortex Web UI Startup Script

echo "🧠 Starting Cortex Web UI..."
echo ""

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not detected. Activating..."
    source ../../.venv/bin/activate
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
pip install -q flask flask-cors 2>/dev/null

# Navigate to web_ui directory
cd "$(dirname "$0")/web_ui"

# Start the server
echo ""
echo "✅ Starting server on http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""

python app.py
