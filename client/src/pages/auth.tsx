import { useState } from "react";
import { useAppStore, CURRENT_USER, TRAINER_USER } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell } from "lucide-react";

// Import the stock image we downloaded
import heroBg from "@assets/stock_images/fitness_workout_gym__7023b269.jpg";

export default function AuthPage() {
  const { setUser } = useAppStore();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: "client" | "trainer") => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const user = role === "client" ? CURRENT_USER : TRAINER_USER;
      setUser(user);
      setIsLoading(false);
      setLocation(role === "trainer" ? "/trainer" : "/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
              <Dumbbell className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TRAINIO</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Transform Your Body,<br/>Transform Your Life.</h1>
            <p className="text-xl text-gray-300 max-w-md">
              Connect with expert trainers, track your progress, and achieve your fitness goals with our all-in-one platform.
            </p>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 Trainio Fitness App. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
                <Dumbbell className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="trainer">Trainer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="client">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin("client"); }}>
                  <div className="space-y-2">
                    <Label htmlFor="email-client">Email</Label>
                    <Input id="email-client" placeholder="alex@example.com" defaultValue="alex@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-client">Password</Label>
                    <Input id="password-client" type="password" required defaultValue="password" />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Client"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="trainer">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin("trainer"); }}>
                  <div className="space-y-2">
                    <Label htmlFor="email-trainer">Email</Label>
                    <Input id="email-trainer" placeholder="coach@trainio.com" defaultValue="coach@trainio.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-trainer">Password</Label>
                    <Input id="password-trainer" type="password" required defaultValue="password" />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Trainer"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Sign up</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
