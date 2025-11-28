import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { MOCK_WORKOUTS } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  ChevronLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  RotateCcw,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ActiveWorkoutPage() {
  const [, params] = useRoute("/workout/:id/active");
  const [, setLocation] = useLocation();
  const workoutId = params?.id;
  const workout = MOCK_WORKOUTS.find(w => w.id === workoutId);

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout) return <div>Workout not found</div>;

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const progress = (completedSets.size / totalSets) * 100;

  const toggleSet = (exerciseIdx: number, setIdx: number) => {
    const key = `${exerciseIdx}-${setIdx}`;
    const newCompleted = new Set(completedSets);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedSets(newCompleted);
  };

  const handleFinish = () => {
    // In a real app, save data here
    setLocation("/workouts");
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Quit Workout?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to quit? Your progress will be discarded.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setLocation("/workouts")}>Quit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div>
            <h3 className="font-bold leading-none">{workout.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {completedSets.size} of {totalSets} sets completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 px-3 py-1.5 rounded-md flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono font-bold text-primary">{formatTime(time)}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-1 rounded-none" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {workout.exercises.map((exercise, exIndex) => (
          <Card key={exIndex} className={cn("transition-all", exIndex === currentExerciseIndex ? "border-primary ring-1 ring-primary/20" : "opacity-80")}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg">{exercise.name}</h4>
                {exercise.weight && (
                   <span className="text-xs font-bold bg-muted px-2 py-1 rounded">{exercise.weight}</span>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground font-medium mb-2 px-2">
                  <div className="text-center">SET</div>
                  <div className="text-center">KG</div>
                  <div className="text-center">REPS</div>
                  <div className="text-center">DONE</div>
                </div>
                
                {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                  const isCompleted = completedSets.has(`${exIndex}-${setIndex}`);
                  return (
                    <div 
                      key={setIndex} 
                      className={cn(
                        "grid grid-cols-4 gap-4 items-center p-2 rounded transition-colors",
                        isCompleted ? "bg-green-500/10" : "bg-muted/30"
                      )}
                    >
                      <div className="text-center font-bold text-sm">{setIndex + 1}</div>
                      <div className="text-center text-sm">{exercise.weight || "-"}</div>
                      <div className="text-center text-sm">{exercise.reps}</div>
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={isCompleted}
                          onCheckedChange={() => toggleSet(exIndex, setIndex)}
                          className="h-6 w-6 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button className="w-full h-12 text-lg gap-2" onClick={handleFinish}>
          <CheckCircle2 className="h-5 w-5" />
          Finish Workout
        </Button>
      </div>
    </div>
  );
}
