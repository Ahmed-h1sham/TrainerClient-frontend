import { useState } from "react";
import { useAppStore, CURRENT_USER, TRAINER_USER } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, UserPlus, LogIn, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Import the stock image we downloaded
import heroBg from "@assets/stock_images/fitness_workout_gym__7023b269.jpg";

export default function AuthPage() {
  const { setUser } = useAppStore();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(location === "/signup" ? "signup" : "login");

  const handleAuth = (role: "client" | "trainer", isSignup: boolean) => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const user = role === "client" ? { ...CURRENT_USER } : { ...TRAINER_USER };
      
      if (isSignup) {
        toast.success("Account created successfully!");
      }
      
      setUser(user);
      setIsLoading(false);
      setLocation(role === "trainer" ? "/trainer" : "/dashboard");
    }, 1200);
  };

  const toggleMode = () => {
    const newMode = mode === "login" ? "signup" : "login";
    setMode(newMode);
    setLocation(newMode === "signup" ? "/signup" : "/auth");
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-background">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-10000 hover:scale-110"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-black/80 to-black" />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Dumbbell className="h-7 w-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter italic">TRAINIO</span>
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Join 5,000+ Active Members
            </div>
            <h1 className="text-6xl font-bold leading-tight tracking-tight">
              {mode === "login" ? (
                <>Elevate Your <span className="text-primary italic">Fitness</span> Journey.</>
              ) : (
                <>Start Your <span className="text-primary italic">Transformation</span> Today.</>
              )}
            </h1>
            <p className="text-xl text-gray-300 max-w-md leading-relaxed font-light">
              Experience the future of personal training. Real-time tracking, expert coaching, and a community that pushes you further.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold">Expert Trainers</h4>
                  <p className="text-sm text-gray-400">Certified professionals at your fingertips.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold">Smart Tracking</h4>
                  <p className="text-sm text-gray-400">AI-driven insights for your progress.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            © 2025 Trainio Performance Labs. Built for Excellence.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-0 right-0 p-8">
          <Button variant="ghost" className="gap-2 font-medium" onClick={toggleMode}>
            {mode === "login" ? (
              <><UserPlus className="h-4 w-4" /> Create an account</>
            ) : (
              <><LogIn className="h-4 w-4" /> Back to login</>
            )}
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Dumbbell className="h-7 w-7" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">TRAINIO</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted-foreground font-medium">
              {mode === "login" ? "Enter your credentials to access your portal" : "Join the elite community of fitness enthusiasts"}
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <Tabs defaultValue="client" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger value="client" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Client</TabsTrigger>
                  <TabsTrigger value="trainer" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Trainer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="client" className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <form className="space-y-4" onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleAuth("client", mode === "signup"); 
                  }}>
                    {mode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="name-signup">Full Name</Label>
                        <Input id="name-signup" placeholder="Alex Johnson" required className="h-12 px-4 rounded-xl" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email-client">Email Address</Label>
                      <Input id="email-client" type="email" placeholder="alex@example.com" required className="h-12 px-4 rounded-xl" />
                    </div>
                    {mode === "login" && (
                      <div className="space-y-2">
                        <Label htmlFor="student-number">Student Number</Label>
                        <Input id="student-number" placeholder="12345678" required className="h-12 px-4 rounded-xl" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password-client">Password</Label>
                        {mode === "login" && (
                          <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                        )}
                      </div>
                      <Input id="password-client" type="password" required className="h-12 px-4 rounded-xl" />
                    </div>
                    {mode === "signup" && (
                      <div className="flex items-center space-x-2 pt-2">
                        <input type="checkbox" id="terms" className="rounded border-gray-300 text-primary focus:ring-primary" required />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        </label>
                      </div>
                    )}
                    <Button className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : (mode === "login" ? "Sign In" : "Create Client Account")}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="trainer" className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <form className="space-y-4" onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleAuth("trainer", mode === "signup"); 
                  }}>
                    {mode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="trainer-name">Full Name</Label>
                        <Input id="trainer-name" placeholder="Coach Mike" required className="h-12 px-4 rounded-xl" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email-trainer">Email Address</Label>
                      <Input id="email-trainer" type="email" placeholder="coach@trainio.com" required className="h-12 px-4 rounded-xl" />
                    </div>
                    {mode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="certification">Primary Certification</Label>
                        <Input id="certification" placeholder="NASM, ACE, etc." required className="h-12 px-4 rounded-xl" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password-trainer">Password</Label>
                        {mode === "login" && (
                          <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                        )}
                      </div>
                      <Input id="password-trainer" type="password" required className="h-12 px-4 rounded-xl" />
                    </div>
                    <Button className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : (mode === "login" ? "Sign In" : "Join as Trainer")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>New to Trainio? <button onClick={toggleMode} className="text-primary hover:underline font-bold">Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={toggleMode} className="text-primary hover:underline font-bold">Sign in here</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
