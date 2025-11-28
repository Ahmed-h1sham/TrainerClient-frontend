import { useState } from "react";
import { MOCK_WORKOUTS, useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Dumbbell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  Filter,
  MoreHorizontal,
  Search,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WorkoutsPage() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const [selectedWorkout, setSelectedWorkout] = useState<typeof MOCK_WORKOUTS[0] | null>(null);

  // Mock data for trainer view
  const trainerClients = [
    { id: 1, name: "Alex Client", plan: "Hypertrophy A", lastWorkout: "Today", compliance: 92, status: "completed", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" },
    { id: 2, name: "Sarah Smith", plan: "Fat Loss B", lastWorkout: "Yesterday", compliance: 85, status: "pending", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { id: 3, name: "Mike Jones", plan: "Marathon Prep", lastWorkout: "2 days ago", compliance: 60, status: "missed", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" },
    { id: 4, name: "Emily Wilson", plan: "Tone & Sculpt", lastWorkout: "Today", compliance: 98, status: "completed", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
  ];

  // Trainer View
  if (user?.role === 'trainer') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Workouts</h1>
            <p className="text-muted-foreground">Monitor client adherence and assign new plans.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Dumbbell className="h-4 w-4 mr-2" />
              Assign Workout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Progress</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-8 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Current Plan</th>
                  <th className="px-6 py-3">Latest Status</th>
                  <th className="px-6 py-3">Adherence</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trainerClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.img} />
                          <AvatarFallback>{client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-foreground">{client.name}</div>
                          <div className="text-xs text-muted-foreground">Last seen: {client.lastWorkout}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{client.plan}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {client.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {client.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {client.status === 'missed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span className="capitalize text-muted-foreground">{client.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", 
                              client.compliance > 90 ? "bg-green-500" : 
                              client.compliance > 75 ? "bg-yellow-500" : "bg-red-500"
                            )} 
                            style={{ width: `${client.compliance}%` }} 
                          />
                        </div>
                        <span className="text-xs">{client.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">View Log</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Client View Logic
  const activeWorkouts = MOCK_WORKOUTS.filter(w => w.status === 'pending');
  const completedWorkouts = MOCK_WORKOUTS.filter(w => w.status === 'completed');

  const handleStartWorkout = (id: string) => {
    setLocation(`/workout/${id}/active`);
  };

  const WorkoutCard = ({ workout }: { workout: typeof MOCK_WORKOUTS[0] }) => (
    <Card className="hover:border-primary/50 transition-all cursor-pointer group overflow-hidden" onClick={() => setSelectedWorkout(workout)}>
      <div className="flex flex-col md:flex-row">
        <div className="h-32 md:h-auto w-full md:w-32 bg-muted flex items-center justify-center shrink-0 relative group-hover:bg-primary/5 transition-colors">
           <Dumbbell className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
           {workout.status === 'completed' && (
             <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
               <CheckCircle2 className="h-8 w-8 text-green-600" />
             </div>
           )}
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{new Date(workout.date).toLocaleDateString()}</Badge>
                {workout.status === 'completed' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>}
              </div>
              <h3 className="font-bold text-lg">{workout.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {workout.exercises.map(e => e.name).join(", ")}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <span>{workout.exercises.length} Exercises</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>45 min</span>
            </div>
          </div>
        </div>
        <div className="p-6 flex items-center border-l border-border/50 bg-muted/10">
          <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">View and manage your training sessions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeWorkouts.length > 0 ? (
             activeWorkouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming workouts found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {completedWorkouts.length > 0 ? (
             completedWorkouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No workout history yet.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Workout Detail Dialog */}
      <Dialog open={!!selectedWorkout} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{selectedWorkout?.date ? new Date(selectedWorkout.date).toLocaleDateString() : ''}</Badge>
              {selectedWorkout?.status === 'completed' && <Badge className="bg-green-100 text-green-700">Completed</Badge>}
            </div>
            <DialogTitle className="text-2xl">{selectedWorkout?.title}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.exercises.length} exercises • Estimated duration: 45 mins
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedWorkout?.exercises.map((exercise, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 mt-1">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{exercise.name}</h4>
                    {exercise.weight && <Badge variant="secondary">{exercise.weight}</Badge>}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-background p-2 rounded border text-center">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Sets</span>
                      <span className="font-bold">{exercise.sets}</span>
                    </div>
                    <div className="bg-background p-2 rounded border text-center">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Reps</span>
                      <span className="font-bold">{exercise.reps}</span>
                    </div>
                    <div className="bg-background p-2 rounded border text-center">
                      <span className="block text-muted-foreground text-xs uppercase tracking-wider">Rest</span>
                      <span className="font-bold">{exercise.rest || "60s"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setSelectedWorkout(null)}>Close</Button>
            {selectedWorkout?.status === 'pending' && (
              <Button className="gap-2" onClick={() => handleStartWorkout(selectedWorkout!.id)}>
                <PlayCircle className="h-4 w-4" />
                Start Workout
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
