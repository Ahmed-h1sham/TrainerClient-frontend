import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_WORKOUTS } from "@/lib/store";
import { Clock, Video, Dumbbell, ChevronRight } from "lucide-react";

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock schedule events mixed with workouts
  const events = [
    ...MOCK_WORKOUTS.map(w => ({
      id: w.id,
      title: w.title,
      date: new Date(w.date),
      type: "workout",
      time: "10:00 AM"
    })),
    { id: "c1", title: "Check-in Call", date: new Date(), type: "call", time: "02:00 PM" },
    { id: "c2", title: "Weekly Review", date: new Date(Date.now() + 86400000 * 2), type: "call", time: "04:00 PM" }
  ];

  const selectedDateEvents = events.filter(
    e => e.date.toDateString() === date?.toDateString()
  );

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your training sessions and meetings.</p>
        </div>
        <Button>+ Add Event</Button>
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
                      {event.type === 'workout' ? <Dumbbell className="h-6 w-6" /> : <Video className="h-6 w-6" />}
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
                  <Button variant="link" className="mt-2">Add something?</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
