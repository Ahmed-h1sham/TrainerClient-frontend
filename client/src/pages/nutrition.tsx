import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Utensils, 
  Apple, 
  Coffee, 
  Moon, 
  Plus, 
  ChevronRight,
  Info,
  TrendingUp,
  AlertTriangle,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function NutritionPage() {
  const { user, meals, addMeal, clients } = useAppStore();
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);

  // Trainer View
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePlanOpen, setUpdatePlanOpen] = useState(false);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const { updateClientNutrition } = useAppStore();

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const calories = Number(formData.get('calories'));
    const protein = Number(formData.get('protein'));
    const carbs = Number(formData.get('carbs'));
    const fats = Number(formData.get('fats'));

    updateClientNutrition(selectedClient.id, calories, protein, carbs, fats);
    setUpdatePlanOpen(false);
    toast.success(`Updated nutrition targets for ${selectedClient.name}`);
  };

  if (user?.role === 'trainer') {
    const filteredClients = clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Nutrition</h1>
            <p className="text-muted-foreground">Track client meal logs and macro targets.</p>
          </div>
          <Button onClick={() => setUpdatePlanOpen(true)} disabled={!selectedClient} variant={!selectedClient ? "outline" : "default"}>
            <Utensils className="h-4 w-4 mr-2" />
            Update Plans {selectedClient ? `for ${selectedClient.name}` : '(Select Client below)'}
          </Button>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-8 h-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.length > 0 ? filteredClients.map(client => (
            <Card 
              key={client.id} 
              className={`overflow-hidden cursor-pointer transition-all ${selectedClient?.id === client.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{client.name}</h3>
                      <p className="text-xs text-muted-foreground">Goal: {client.nutritionTargets?.calories || 2000} kcal</p>
                    </div>
                  </div>
                   <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setDiaryOpen(true); }}>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                <div className="text-center text-muted-foreground text-sm py-4">
                  {meals.some(m => m.userId === client.id) ? 'Logs available' : 'No logs for today'}
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center text-muted-foreground p-8">
              No clients found.
            </div>
          )}
        </div>

        {/* Update Plan Dialog */}
        <Dialog open={updatePlanOpen} onOpenChange={setUpdatePlanOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Nutrition Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePlan} className="space-y-4">
              <div className="space-y-2">
                <Label>Daily Calorie Target</Label>
                <Input name="calories" type="number" defaultValue={selectedClient?.nutritionTargets?.calories || 2400} required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input name="protein" type="number" defaultValue={selectedClient?.nutritionTargets?.protein || 160} required />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input name="carbs" type="number" defaultValue={selectedClient?.nutritionTargets?.carbs || 250} required />
                </div>
                <div className="space-y-2">
                  <Label>Fats (g)</Label>
                  <Input name="fats" type="number" defaultValue={selectedClient?.nutritionTargets?.fats || 70} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Targets</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

         {/* Diary Dialog */}
         <Dialog open={diaryOpen} onOpenChange={setDiaryOpen}>
           <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>{selectedClient?.name}'s Food Diary</DialogTitle>
             </DialogHeader>
             <div className="space-y-4">
               {/* Filtered diary view by client ID */}
               <p className="text-muted-foreground text-sm">Showing recent meals...</p>
               {meals.filter(m => m.userId === selectedClient?.id).length > 0 ? meals.filter(m => m.userId === selectedClient?.id).map((meal, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                     <div>
                       <p className="font-medium">{meal.name}</p>
                       <p className="text-xs text-muted-foreground capitalize">{meal.type}</p>
                     </div>
                     <div className="text-right text-sm">
                       <span className="font-bold">{meal.calories} kcal</span>
                       <p className="text-xs text-muted-foreground">
                         {meal.protein}P • {meal.carbs}C • {meal.fats}F
                       </p>
                     </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">No meals logged for this client yet.</div>
                )}
             </div>
           </DialogContent>
         </Dialog>
      </div>
    );
  }

  // Client View Logic
  const todaysMeals = meals.filter(m => {
     // Check if meal date is today (ignoring time component for simplicity in this prototype)
     return new Date(m.date).toDateString() === new Date().toDateString() && m.userId === user?.id;
  });

  const groupedMeals = {
    breakfast: todaysMeals.filter(m => m.type === 'breakfast'),
    lunch: todaysMeals.filter(m => m.type === 'lunch'),
    dinner: todaysMeals.filter(m => m.type === 'dinner'),
    snack: todaysMeals.filter(m => m.type === 'snack'),
  };

  const macros = todaysMeals.reduce((acc, meal) => ({
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fats: acc.fats + (meal.fats || 0),
    calories: acc.calories + (meal.calories || 0)
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

  const targets = user?.nutritionTargets || {
    calories: 2400,
    protein: 160,
    carbs: 250,
    fats: 70
  };

  const handleLogMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const type = formData.get('type') as any;
    const calories = Number(formData.get('calories'));
    const protein = Number(formData.get('protein'));
    const carbs = Number(formData.get('carbs'));
    const fats = Number(formData.get('fats'));

    if (name && type && user) {
      addMeal({
        id: `meal${Date.now()}`,
        userId: user.id,
        name,
        type,
        calories,
        protein,
        carbs,
        fats,
        date: new Date().toISOString()
      });
      setIsLogMealOpen(false);
      toast.success("Meal logged successfully");
    }
  };

  const MealSection = ({ title, icon: Icon, items }: { title: string, icon: any, items: any[] }) => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg capitalize">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsLogMealOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? items.map((item, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.calories} kcal • {item.protein}P • {item.carbs}C • {item.fats}F
              </p>
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )) : (
          <div className="text-sm text-muted-foreground text-center py-2">No meals logged.</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
          <p className="text-muted-foreground">Track your meals and macros.</p>
        </div>
        
        <Dialog open={isLogMealOpen} onOpenChange={setIsLogMealOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Meal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogMeal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meal Name</Label>
                <Input id="name" name="name" required placeholder="e.g. Grilled Chicken Salad" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Meal Type</Label>
                 <Select name="type" defaultValue="lunch">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input id="calories" name="calories" type="number" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input id="protein" name="protein" type="number" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" name="carbs" type="number" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input id="fats" name="fats" type="number" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Log</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Macros */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Calories Remaining</p>
                  <h2 className="text-4xl font-bold">{Math.max(0, targets.calories - macros.calories)}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Target: {targets.calories}</p>
                </div>
              </div>
              <Progress value={(macros.calories / targets.calories) * 100} className="h-3 bg-primary-foreground/20 [&>div]:bg-white" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Macros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Protein</span>
                  <span className="text-muted-foreground">{macros.protein} / {targets.protein}g</span>
                </div>
                <Progress value={(macros.protein / targets.protein) * 100} className="h-2 bg-muted [&>div]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Carbs</span>
                  <span className="text-muted-foreground">{macros.carbs} / {targets.carbs}g</span>
                </div>
                <Progress value={(macros.carbs / targets.carbs) * 100} className="h-2 bg-muted [&>div]:bg-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Fats</span>
                  <span className="text-muted-foreground">{macros.fats} / {targets.fats}g</span>
                </div>
                <Progress value={(macros.fats / targets.fats) * 100} className="h-2 bg-muted [&>div]:bg-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Meal Plan */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="plan">Full Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MealSection title="Breakfast" icon={Coffee} items={groupedMeals.breakfast} />
              <MealSection title="Lunch" icon={Utensils} items={groupedMeals.lunch} />
              <MealSection title="Dinner" icon={Moon} items={groupedMeals.dinner} />
              <MealSection title="Snacks" icon={Apple} items={groupedMeals.snack} />
            </TabsContent>
            
            <TabsContent value="plan">
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                <p>Weekly meal plan view coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
