import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { 
  LayoutDashboard, 
  Dumbbell, 
  Calendar, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu,
  Utensils,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, setUser } = useAppStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = user?.role || "client";

  const navItems = [
    { label: "Dashboard", href: role === "trainer" ? "/trainer" : "/dashboard", icon: LayoutDashboard },
    { label: "Workouts", href: "/workouts", icon: Dumbbell },
    { label: "Nutrition", href: "/nutrition", icon: Utensils },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Chat", href: "/chat", icon: MessageSquare },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/auth";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
          <Dumbbell className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">TRAINIO</span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border/50 fixed h-full bg-card z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TRAINIO</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
