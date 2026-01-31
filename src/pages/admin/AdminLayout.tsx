import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Inbox, LayoutDashboard, LogOut, PlusCircle, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminRole } from "@/lib/useAdminRole";

import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AdminDataProvider } from "@/lib/admin/AdminDataContext";
import AdminLoginPage from "./Login";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Add Room", url: "/admin/add-room", icon: PlusCircle, end: false },
  { title: "Inbox", url: "/admin/inbox", icon: Inbox, end: false },
];

function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SP</span>
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-bold">Shabana Palace</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.end}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted/70 transition-colors"
                  activeClassName="bg-muted text-primary font-bold"
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/admin/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-muted/70 transition-colors"
                activeClassName="bg-muted text-primary font-bold"
              >
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors w-full"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { isAdmin, isLoading: isCheckingAdmin } = useAdminRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate("/admin");
  };

  // Loading state - SHOW LOADING if checking auth OR admin status
  if (isAuthenticated === null || (isAuthenticated && isCheckingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  // Check if user is an admin (only after loading is complete)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-destructive text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel. Only authorized administrators can access this area.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar onLogout={handleLogout} />

          <div className="flex-1 min-w-0">
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="h-14 px-4 flex items-center">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="rounded-xl" />
                  <p className="font-bold">Admin Dashboard</p>
                </div>
              </div>
            </header>

            <main className="p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminDataProvider>
  );
}