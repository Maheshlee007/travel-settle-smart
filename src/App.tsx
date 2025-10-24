import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TravelSettlement from "./pages/TravelSettlement";
import ExpenseCapture from "./pages/ExpenseCapture";
import SettlementSuccess from "./pages/SettlementSuccess";
import SettlementStatus from "./pages/SettlementStatus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/travel-settlement" element={<TravelSettlement />} />
          <Route path="/expense-capture" element={<ExpenseCapture />} />
          <Route path="/settlement-success" element={<SettlementSuccess />} />
          <Route path="/settlement-status" element={<SettlementStatus />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
