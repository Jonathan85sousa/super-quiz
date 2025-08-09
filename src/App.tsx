
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./contexts/QuizContext";
import { AppearanceProvider } from "./contexts/AppearanceContext";
import Header from "./components/Header";
import Index from "./pages/Index";
import QuestionManager from "./pages/QuestionManager";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppearanceProvider>
        <QuizProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cadastro" element={<QuestionManager />} />
              <Route path="/jogo" element={<GamePage />} />
              <Route path="/resultados" element={<ResultsPage />} />
              <Route path="/config" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QuizProvider>
      </AppearanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
