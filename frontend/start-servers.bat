@echo off
echo Starting Nirman Learning Platform...

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start cmd /k "npm run frontend"

echo Servers started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 