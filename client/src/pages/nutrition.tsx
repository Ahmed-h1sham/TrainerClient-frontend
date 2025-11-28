import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Utensils, 
  Apple, 
  Coffee, 
  Moon, 
  Plus, 
  ChevronRight,
  Info
} from "lucide-react";

export default function NutritionPage() {
  const meals = {
    breakfast: [
      { name: "Oatmeal with Berries", calories: 350, protein: "12g", carbs: "60g", fats: "6g" },
      { name: "2 Boiled Eggs", calories: 140, protein: "12g", carbs: "1g", fats: "10g" }
    ],
    lunch: [
      { name: "Grilled Chicken Salad", calories: 450, protein: "40g", carbs: "15g", fats: "20g" },
      { name: "Quinoa Side", calories: 150, protein: "6g", carbs: "30g", fats: "2g" }
    ],
    dinner: [
      { name: "Salmon with Asparagus", calories: 500, protein: "35g", carbs: "10g", fats: "30g" },
      { name: "Sweet Potato", calories: 200, protein: "4g", carbs: "45g", fats: "0g" }
    ],
    snacks: [
      { name: "Greek Yogurt", calories: 120, protein: "15g", carbs: "8g", fats: "0g" },
      { name: "Almonds (Handful)", calories: 160, protein: "6g", carbs: "6g", fats: "14g" }
    ]
  };

  const macros = {
    protein: { current: 125, target: 160, color: "bg-blue-500" },
    carbs: { current: 180, target: 250, color: "bg-green-500" },
    fats: { current: 55, target: 70, color: "bg-orange-500" },
    calories: { current: 1850, target: 2400, color: "bg-primary" }
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => (
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
        ))}
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
        <Button>Log Meal</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Macros */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Calories Remaining</p>
                  <h2 className="text-4xl font-bold">{macros.calories.target - macros.calories.current}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Target: {macros.calories.target}</p>
                </div>
              </div>
              <Progress value={(macros.calories.current / macros.calories.target) * 100} className="h-3 bg-primary-foreground/20 [&>div]:bg-white" />
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
                  <span className="text-muted-foreground">{macros.protein.current} / {macros.protein.target}g</span>
                </div>
                <Progress value={(macros.protein.current / macros.protein.target) * 100} className={`h-2 bg-muted [&>div]:${macros.protein.color}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Carbs</span>
                  <span className="text-muted-foreground">{macros.carbs.current} / {macros.carbs.target}g</span>
                </div>
                <Progress value={(macros.carbs.current / macros.carbs.target) * 100} className={`h-2 bg-muted [&>div]:${macros.carbs.color}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Fats</span>
                  <span className="text-muted-foreground">{macros.fats.current} / {macros.fats.target}g</span>
                </div>
                <Progress value={(macros.fats.current / macros.fats.target) * 100} className={`h-2 bg-muted [&>div]:${macros.fats.color}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Tip: Try to eat more protein in the morning to stay fuller for longer.
              </p>
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
              <MealSection title="Breakfast" icon={Coffee} items={meals.breakfast} />
              <MealSection title="Lunch" icon={Utensils} items={meals.lunch} />
              <MealSection title="Dinner" icon={Moon} items={meals.dinner} />
              <MealSection title="Snacks" icon={Apple} items={meals.snacks} />
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
