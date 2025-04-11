#!/bin/bash

echo "Starting Nirman Learning Platform..."

# Start backend in a new terminal
echo "Starting Backend Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  osascript -e 'tell app "Terminal" to do script "cd \"$(pwd)/backend\" && npm run dev"'
else
  # Linux
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd \"$(pwd)/backend\" && npm run dev; exec bash"
  elif command -v xterm &> /dev/null; then
    xterm -e "cd \"$(pwd)/backend\" && npm run dev; exec bash" &
  else
    echo "Could not find terminal emulator. Please start backend manually with:"
    echo "cd backend && npm run dev"
  fi
fi

# Start frontend in a new terminal
echo "Starting Frontend Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  osascript -e 'tell app "Terminal" to do script "cd \"$(pwd)\" && npm run frontend"'
else
  # Linux
  if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd \"$(pwd)\" && npm run frontend; exec bash"
  elif command -v xterm &> /dev/null; then
    xterm -e "cd \"$(pwd)\" && npm run frontend; exec bash" &
  else
    echo "Could not find terminal emulator. Please start frontend manually with:"
    echo "npm run frontend"
  fi
fi

echo "Servers started successfully!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173" 