import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import ClientDashboard from "@/pages/client-dashboard";
import TrainerDashboard from "@/pages/trainer-dashboard";
import WorkoutsPage from "@/pages/workouts";
import SchedulePage from "@/pages/schedule";
import ChatPage from "@/pages/chat";
import ProfilePage from "@/pages/profile";
import ActiveWorkoutPage from "@/pages/active-workout";
import NutritionPage from "@/pages/nutrition";
import Layout from "@/components/Layout";
import { useAppStore } from "@/lib/store";

function ProtectedRoute({ component: Component, role }: { component: any, role?: string }) {
  const { user } = useAppStore();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (role && user.role !== role) {
    return <Redirect to={user.role === "trainer" ? "/trainer" : "/dashboard"} />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  const { user } = useAppStore();

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      
      <Route path="/">
        {user ? <Redirect to={user.role === "trainer" ? "/trainer" : "/dashboard"} /> : <Redirect to="/auth" />}
      </Route>

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={ClientDashboard} role="client" />
      </Route>
      
      <Route path="/trainer">
        <ProtectedRoute component={TrainerDashboard} role="trainer" />
      </Route>

      <Route path="/workouts">
        <ProtectedRoute component={WorkoutsPage} />
      </Route>
      
      {/* Full screen active workout view - no layout */}
      <Route path="/workout/:id/active" component={ActiveWorkoutPage} />

      <Route path="/nutrition">
        <ProtectedRoute component={NutritionPage} />
      </Route>

      <Route path="/schedule">
        <ProtectedRoute component={SchedulePage} />
      </Route>

      <Route path="/chat">
        <ProtectedRoute component={ChatPage} />
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
