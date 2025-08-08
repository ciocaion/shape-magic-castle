import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { tutorService } from './services/tutorService';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

const getBasename = (): string => {
  const path = window.location.pathname;
  const parts = path.split("/");

  // Check if the path structure is /flows/{uuid}
  if (parts.length > 2 && parts[1] === "flows") {
    return `/${parts[1]}/${parts[2]}`;
  }

  return "/";
};

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === 'setFlowLanguage') {
        const rawCode = String(event?.data?.languageCode || '').toLowerCase();
        // Map incoming codes: en -> en, dk -> da, da -> da
        const mapped = rawCode === 'dk' ? 'da' : rawCode === 'da' ? 'da' : 'en';
        i18n.changeLanguage(mapped).then(() => {
          // Resend the last tutor message in the new language
          tutorService.resendLastMessage(i18n.t as any);
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={getBasename()}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
