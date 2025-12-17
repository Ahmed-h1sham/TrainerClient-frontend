import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Video, Dumbbell, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
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

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { workouts, events, addEvent } = useAppStore();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Combine Workouts and Custom Events
  const allEvents = [
    ...workouts.map(w => ({
      id: w.id,
      title: w.title,
      date: new Date(w.date),
      type: "workout" as const, // explicitly cast literals if needed
      time: "10:00 AM" // Default time for workouts if not specified
    })),
    ...events.map(e => ({
      ...e,
      date: new Date(e.date)
    }))
  ];

  const selectedDateEvents = allEvents.filter(
    e => e.date.toDateString() === date?.toDateString()
  );

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const time = formData.get('time') as string;
    const type = formData.get('type') as "call" | "reminder";

    if (title && time && date) {
      addEvent({
        id: `e${Date.now()}`,
        title,
        date: date.toISOString(),
        time,
        type: type || "reminder"
      });
      setIsAddEventOpen(false);
      toast.success("Event added successfully");
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your training sessions and meetings.</p>
        </div>
        
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event for {date?.toLocaleDateString()}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" required placeholder="Status update..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="call">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">save Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardContent className="p-6 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Day Details */}
        <div className="lg:col-span-4">
          <Card className="h-full border-none shadow-lg bg-muted/20">
            <CardHeader>
              <CardTitle>{date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event, i) => (
                  <div key={i} className="bg-card p-4 rounded-lg border shadow-sm flex gap-4 items-center animate-in slide-in-from-right-4 fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                      event.type === 'workout' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {event.type === 'workout' ? <Dumbbell className="h-6 w-6" /> : (event.type === 'call' ? <Video className="h-6 w-6" /> : <CalendarIcon className="h-6 w-6" />)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No events scheduled for this day.</p>
                  <Button variant="link" className="mt-2" onClick={() => setIsAddEventOpen(true)}>Add something?</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
