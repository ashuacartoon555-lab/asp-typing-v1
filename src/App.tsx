import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SoundProvider } from "./contexts/SoundContext";
import CookieConsent from "./components/CookieConsent";
import BackToTop from "./components/BackToTop";
import Index from "./pages/Index";
import Tutorial from "./pages/Tutorial";
import Games from "./pages/Games";
import ExamMode from "./pages/ExamMode";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Blog from "./pages/Blog";
import TypingSpeedTips from "./pages/TypingSpeedTips";
import Analytics from "./pages/Analytics";
import IncreaseTypingSpeed from "./pages/tips/IncreaseTypingSpeed";
import TypingPracticeBeginners from "./pages/tips/TypingPracticeBeginners";
import SSCBankingTypingGuide from "./pages/tips/SSCBankingTypingGuide";
import EnglishTypingRules from "./pages/tips/EnglishTypingRules";
import TypingAccuracyImprovement from "./pages/tips/TypingAccuracyImprovement";
import NotFound from "./pages/NotFound";
import FloatingSoundControl from "./components/FloatingSoundControl";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SoundProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/games" element={<Games />} />
              <Route path="/exam-mode" element={<ExamMode />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/tips" element={<TypingSpeedTips />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tips/increase-typing-speed" element={<IncreaseTypingSpeed />} />
              <Route path="/tips/typing-practice-beginners" element={<TypingPracticeBeginners />} />
              <Route path="/tips/ssc-banking-typing-guide" element={<SSCBankingTypingGuide />} />
              <Route path="/tips/english-typing-rules" element={<EnglishTypingRules />} />
              <Route path="/tips/typing-accuracy-improvement" element={<TypingAccuracyImprovement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
            <BackToTop />
            <FloatingSoundControl />
          </BrowserRouter>
        </TooltipProvider>
      </SoundProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
