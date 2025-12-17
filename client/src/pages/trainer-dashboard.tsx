import { useState } from "react";
import { useAppStore, type User, type Workout } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Search,
  MoreHorizontal,
  ArrowUpRight,
  Dumbbell,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { Toaster, toast } from "sonner";

export default function TrainerDashboard() {
  const { clients, addClient, assignWorkout, messages, events, user, workouts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [, setLocation] = useLocation();

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats Logic
  const today = new Date().toISOString().split('T')[0];
  const sessionsToday = events.filter(e => e.date === today && e.type === 'workout').length + 
                        workouts.filter(w => w.date === today).length;
  
  const unreadMessages = messages.filter(m => m.receiverId === user?.id).length;
  // Unique senders
  const uniqueSenders = new Set(messages.filter(m => m.receiverId === user?.id).map(m => m.senderId)).size;

  const [exercises, setExercises] = useState<{name: string, sets: number, reps: string, weight: string, rest: string}[]>([]);

  // Tasks Logic (Events)
  const todaysTasks = events
    .filter(e => e.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newClient: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      studentNumber: formData.get('studentNumber') as string,
      role: 'client',
      goals: [],
      metrics: {
        height: 0,
        weight: 0,
        age: 0
      },
      avatar: `https://ui-avatars.com/api/?name=${formData.get('name')}&background=random`
    };
    addClient(newClient);
    setIsNewClientOpen(false);
    toast.success("Client added successfully");
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
    if (!selectedClient) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const newWorkout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedClient.id,
      title: formData.get('title') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      exercises: exercises.length > 0 ? exercises : [
        { name: "Push Ups", sets: 3, reps: "15", rest: "60s" },
         { name: "Squats", sets: 4, reps: "12", weight: "20kg", rest: "60s" }
      ]
    };
    
    assignWorkout(selectedClient.id, newWorkout);
    setIsAssignOpen(false);
    setExercises([]);
    toast.success(`Workout assigned to ${selectedClient.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Dashboard</h1>
          <p className="text-muted-foreground">Manage your clients and schedules.</p>
        </div>
        
        <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Create a profile for a new student.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentNumber">Student Number</Label>
                <Input id="studentNumber" name="studentNumber" required placeholder="12345678" />
              </div>
              <DialogFooter>
                <Button type="submit">Create Profile</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <h3 className="text-3xl font-bold">{clients.length}</h3>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +1 this week
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions Today</p>
              <h3 className="text-3xl font-bold">{sessionsToday}</h3>
              <p className="text-xs text-muted-foreground mt-1">Based on schedule</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <h3 className="text-3xl font-bold">{unreadMessages}</h3>
              <p className="text-xs text-blue-600 mt-1">From {uniqueSenders} clients</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <MessageSquare className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Clients</h2>
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

          <Card>
             <div className="p-0">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                   <tr>
                     <th className="px-6 py-3">Client</th>
                     <th className="px-6 py-3">Student #</th>
                     <th className="px-6 py-3">Goals</th>
                     <th className="px-6 py-3 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredClients.map((client) => (
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
                       <td className="px-6 py-4">{client.studentNumber || "N/A"}</td>
                       <td className="px-6 py-4">
                         {(client.goals || []).map(g => (
                            <span key={g} className="px-2 py-1 bg-secondary rounded-full text-xs mr-1">{g}</span>
                         ))}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => setLocation(`/chat?userId=${client.id}`)}>
                               Message
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => {
                               setSelectedClient(client);
                               setIsAssignOpen(true);
                             }}>
                               Assign Workout
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setLocation('/nutrition')}>
                               Assign Nutrition
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </td>
                     </tr>
                   ))}
                   {filteredClients.length === 0 && (
                     <tr>
                       <td colSpan={4} className="p-8 text-center text-muted-foreground">
                         No clients found.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </Card>
        </div>

        {/* Right Side - Tasks */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tasks & Reminders</h2>
          <Card>
             <CardHeader>
              <CardTitle className="text-base">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysTasks.length > 0 ? todaysTasks.map((task, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-muted-foreground w-16 pt-1">{task.time}</div>
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground capitalize">{task.type}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center">No tasks scheduled for today.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Workout Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Assign Workout to {selectedClient?.name}</DialogTitle>
            <DialogDescription>Create a customized workout plan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignWorkout} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => { setIsAssignOpen(false); setExercises([]); }}>Cancel</Button>
              <Button type="submit">Assign Workout</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
