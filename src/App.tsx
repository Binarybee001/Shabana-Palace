import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import MoreRooms from "./pages/MoreRooms";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminAddRoomPage from "./pages/admin/AddRoom";
import AdminInboxPage from "./pages/admin/Inbox";
import AdminSettingsPage from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log('Testing Supabase connection...');
    console.log('Supabase client:', supabase);
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/all-rooms" element={<MoreRooms />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="add-room" element={<AdminAddRoomPage />} />
              <Route path="inbox" element={<AdminInboxPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;