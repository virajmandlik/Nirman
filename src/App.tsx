
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalizedContent from "./pages/PersonalizedContent";
import InteractiveCoding from "./pages/InteractiveCoding";
import GamifiedLearning from "./pages/GamifiedLearning";
import MultilingualAssistant from "./pages/MultilingualAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/personalized" element={<PersonalizedContent />} />
          <Route path="/gamified" element={<GamifiedLearning />} />
          <Route path="/coding" element={<InteractiveCoding />} />
          <Route path="/assistant" element={<MultilingualAssistant />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
