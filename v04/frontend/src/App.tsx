import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalizedContent from "./pages/PersonalizedContent";
import InteractiveCoding from "./pages/InteractiveCoding";
import GamifiedLearning from "./pages/GamifiedLearning";
import Game from "./pages/Game";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import MultilingualAssistant from "./pages/MultilingualAssistant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearningPathSelection from "./pages/LearningPathSelection";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <GameProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/select-learning-path" element={<LearningPathSelection />} />
              <Route 
                path="/personalized" 
                element={
                  <ProtectedRoute>
                    <PersonalizedContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gamified-learning" 
                element={
                  <ProtectedRoute>
                    <GamifiedLearning />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gamified" 
                element={
                  <Navigate to="/gamified-learning" replace />
                } 
              />
              <Route 
                path="/games" 
                element={
                  <ProtectedRoute>
                    <GamifiedLearning />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/games/:category" 
                element={
                  <ProtectedRoute>
                    <GamifiedLearning />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/game/:gameId" 
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/game-play/:gameId" 
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/game-results/:gameId" 
                element={
                  <ProtectedRoute>
                    <GamifiedLearning />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/achievements" 
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leaderboard/:gameId" 
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/coding" 
                element={
                  <ProtectedRoute>
                    <InteractiveCoding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assistant" 
                element={
                  <ProtectedRoute>
                    <MultilingualAssistant />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GameProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
