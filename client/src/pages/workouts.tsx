import { useState } from "react";
import { useAppStore, type User, type Workout } from "@/lib/store";
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
  AlertCircle,
  X,
  Plus
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function WorkoutsPage() {
  const { user, workouts, clients } = useAppStore();
  const [, setLocation] = useLocation();
  const [selectedWorkout, setSelectedWorkout] = useState<typeof workouts[0] | null>(null);

  // Trainer View
  const [assignOpen, setAssignOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientForAssign, setSelectedClientForAssign] = useState<User | null>(null);
  const [exercises, setExercises] = useState<{name: string, sets: number, reps: string, weight: string, rest: string}[]>([]);

  const { assignWorkout: assignWorkoutAction } = useAppStore();

  const handleAssignClick = () => {
    setSelectedClientForAssign(null);
    setExercises([]);
    setAssignOpen(true);
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: "10-12", weight: "", rest: "60s" }]);
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleAssignWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForAssign) {
       toast.error("Please select a client");
       return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const newWorkout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedClientForAssign.id,
      title: formData.get('title') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      exercises: exercises.length > 0 ? exercises : [
        { name: "Push Ups", sets: 3, reps: "15", rest: "60s" },
        { name: "Squats", sets: 4, reps: "12", weight: "20kg", rest: "60s" }
      ]
    };
    
    assignWorkoutAction(selectedClientForAssign.id, newWorkout);
    setAssignOpen(false);
    setExercises([]);
    toast.success(`Workout assigned to ${selectedClientForAssign.name}`);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (user?.role === 'trainer') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Workouts</h1>
            <p className="text-muted-foreground">Monitor client adherence and assign new plans.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Filter feature coming soon")}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button onClick={handleAssignClick}>
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
                <Input 
                  placeholder="Search clients..." 
                  className="pl-8 h-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Goals</th>
                  <th className="px-6 py-3">Metrics</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-foreground">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{client.goals?.join(", ")}</td>
                    <td className="px-6 py-4">
                      {client.metrics ? `${client.metrics.weight}kg • ${client.metrics.height}cm` : '--'}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" onClick={() => { 
                         setSelectedClientForAssign(client);
                         setExercises([]);
                         setAssignOpen(true);
                       }}>Assign</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setCurrentClient(client); setHistoryOpen(true); }}>View Log</Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
        
        {/* Assign Dialog */}
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Assign Workout {selectedClientForAssign ? `to ${selectedClientForAssign.name}` : ''}</DialogTitle>
              <DialogDescription>Create a customized workout plan.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssignWorkout} className="space-y-4">
              {!selectedClientForAssign && (
                <div className="space-y-2">
                  <Label>Select Client</Label>
                  <Select onValueChange={(val: string) => setSelectedClientForAssign(clients.find(c => c.id === val) || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Workout Title</Label>
                <Input id="title" name="title" required placeholder="e.g., Upper Body Blast" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Exercises</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addExerciseField}>
                    <Plus className="h-4 w-4 mr-1" /> Add Exercise
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {exercises.map((ex, idx) => (
                    <div key={idx} className="p-3 bg-muted/40 rounded-lg space-y-2 relative border">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setExercises(exercises.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Name</Label>
                          <Input 
                            value={ex.name} 
                            onChange={(e) => updateExercise(idx, 'name', e.target.value)} 
                            placeholder="Bench Press" 
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Sets</Label>
                          <Input 
                            type="number" 
                            value={ex.sets} 
                            onChange={(e) => updateExercise(idx, 'sets', Number(e.target.value))} 
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px]">Reps</Label>
                          <Input 
                            value={ex.reps} 
                            onChange={(e) => updateExercise(idx, 'reps', e.target.value)} 
                            placeholder="8-12" 
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Weight</Label>
                          <Input 
                            value={ex.weight} 
                            onChange={(e) => updateExercise(idx, 'weight', e.target.value)} 
                            placeholder="20kg" 
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Rest</Label>
                          <Input 
                            value={ex.rest} 
                            onChange={(e) => updateExercise(idx, 'rest', e.target.value)} 
                            placeholder="60s" 
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {exercises.length === 0 && (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2 border-dashed border-2 text-center text-muted-foreground text-sm">
                      No exercises added yet. Use the "Add Exercise" button above.
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setAssignOpen(false); setExercises([]); }}>Cancel</Button>
                <Button type="submit">Assign Workout</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Log Dialog */}
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
           <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{currentClient?.name}'s History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                 {workouts.filter(w => w.userId === currentClient?.id && w.status === 'completed').length > 0 ? (
                    workouts.filter(w => w.userId === currentClient?.id && w.status === 'completed').map(w => (
                      <div key={w.id} className="border p-4 rounded-lg flex justify-between items-center">
                         <div>
                           <h4 className="font-bold">{w.title}</h4>
                           <p className="text-xs text-muted-foreground">{new Date(w.date).toLocaleDateString()}</p>
                         </div>
                         <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                      </div>
                    ))
                 ) : (
                   <p className="text-center text-muted-foreground py-8">No completed workouts found for this client.</p>
                 )}
              </div>
           </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Client View Logic
  const activeWorkouts = workouts.filter(w => w.userId === user?.id && w.status === 'pending');
  const completedWorkouts = workouts.filter(w => w.userId === user?.id && w.status === 'completed');

  const handleStartWorkout = (id: string) => {
    setLocation(`/workout/${id}/active`);
  };

  const WorkoutCard = ({ workout }: { workout: typeof workouts[0] }) => (
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
