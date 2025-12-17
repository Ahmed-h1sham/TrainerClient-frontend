import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CalendarCheck, 
  TrendingUp, 
  Activity, 
  Clock, 
  ChevronRight, 
  PlayCircle 
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user, workouts, logWeight } = useAppStore();
  const [, setLocation] = useLocation();
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  
  // Use store workouts instead of mock constant
  const todayWorkout = workouts.find(w => w.date === new Date().toISOString().split('T')[0] && w.userId === user?.id);
  const upcomingWorkouts = workouts.filter(w => w.userId === user?.id && w.status === 'pending' && w.id !== todayWorkout?.id);
  const completedWorkouts = workouts.filter(w => w.userId === user?.id && w.status === 'completed');

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const weight = parseFloat(formData.get('weight') as string);
    if (weight) {
      logWeight(weight);
      setIsWeightDialogOpen(false);
      toast.success("Weight logged successfully!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">Ready to crush your goals today?</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/profile")}>View Progress</Button>
          <Button onClick={() => setLocation("/workouts")}>All Workouts</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Workouts Completed</p>
              <h3 className="text-2xl font-bold">{completedWorkouts.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Weight</p>
              <h3 className="text-2xl font-bold text-green-600">{user?.metrics?.weight || "--"} kg</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Streak</p>
              <h3 className="text-2xl font-bold">5 Days</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Workout */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Today's Session</h2>
          {todayWorkout ? (
            <Card className="overflow-hidden border-primary/20 shadow-lg">
              <div className="h-32 bg-gradient-to-r from-primary to-violet-800 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
                   <Activity className="h-48 w-48" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary-foreground/80 font-medium mb-1">Today's Workout</p>
                      <h3 className="text-3xl font-bold">{todayWorkout.title}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {todayWorkout.exercises.length} Exercises
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todayWorkout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center text-sm font-medium text-muted-foreground">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium">{ex.name}</p>
                          <p className="text-xs text-muted-foreground">{ex.sets} Sets × {ex.reps}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-medium">{ex.weight || "Bodyweight"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  {todayWorkout.status === 'completed' ? (
                     <Button className="w-full gap-2 h-12 text-lg bg-green-600 hover:bg-green-700" disabled>
                        <CalendarCheck className="h-5 w-5" />
                        Workout Complete!
                     </Button>
                  ) : (
                    <Button className="w-full gap-2 h-12 text-lg" onClick={() => setLocation(`/workout/${todayWorkout.id}/active`)}>
                      <PlayCircle className="h-5 w-5" />
                      Start Workout
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <CalendarCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Rest Day</h3>
                  <p className="text-muted-foreground">No workouts scheduled for today. Enjoy your recovery!</p>
                </div>
              </div>
            </Card>
          )}

          {/* Weekly Goals */}
          <h2 className="text-xl font-semibold pt-4">Weekly Goals</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Workouts Completed</span>
                  <span className="text-muted-foreground">3 / 5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Protein Intake (Avg)</span>
                  <span className="text-muted-foreground">120g / 150g</span>
                </div>
                <Progress value={80} className="h-2 bg-muted [&>div]:bg-orange-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Sleep Goal</span>
                  <span className="text-muted-foreground">6.5h / 8h</span>
                </div>
                <Progress value={75} className="h-2 bg-muted [&>div]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Schedule & Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Upcoming</h2>
          <Card>
            <CardContent className="p-0">
              {upcomingWorkouts.length > 0 ? upcomingWorkouts.map((workout, i) => (
                <div key={workout.id} className={cn("p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer", i !== upcomingWorkouts.length - 1 && "border-b")}>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary text-xs font-bold">
                    <span>{new Date(workout.date).getDate()}</span>
                    <span className="uppercase text-[10px] opacity-70">{new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{workout.title}</h4>
                    <p className="text-xs text-muted-foreground">{workout.exercises.length} Exercises • 45 min</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )) : (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No upcoming workouts assigned.
                </div>
              )}
              <div className="p-4 border-t">
                <Button variant="ghost" className="w-full text-sm" size="sm" onClick={() => setLocation("/schedule")}>View Full Schedule</Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold pt-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
              <DialogTrigger asChild>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Log Weight</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Today's Weight</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogWeight} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" name="weight" type="number" step="0.1" required placeholder="e.g. 75.5" defaultValue={user?.metrics?.weight} />
                  </div>
                  <DialogFooter>
                     <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setLocation("/workouts")}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">History</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
