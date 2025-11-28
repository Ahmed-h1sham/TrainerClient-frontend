import { useState } from "react";
import { MOCK_WORKOUTS, useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  Filter,
  MoreHorizontal
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
          {user?.role === 'trainer' && (
            <Button>Create Workout</Button>
          )}
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
