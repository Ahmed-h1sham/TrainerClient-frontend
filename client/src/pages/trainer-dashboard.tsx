import { useAppStore, MOCK_WORKOUTS } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Search,
  MoreHorizontal,
  ArrowUpRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function TrainerDashboard() {
  const { user } = useAppStore();
  
  const clients = [
    { id: 1, name: "Alex Client", status: "Active", plan: "Muscle Build", lastActive: "2h ago", progress: 85, img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" },
    { id: 2, name: "Sarah Smith", status: "Active", plan: "Weight Loss", lastActive: "1d ago", progress: 62, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { id: 3, name: "Mike Jones", status: "Pending", plan: "Endurance", lastActive: "3d ago", progress: 45, img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" },
    { id: 4, name: "Emily Wilson", status: "Active", plan: "Tone & Sculpt", lastActive: "5h ago", progress: 92, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Dashboard</h1>
          <p className="text-muted-foreground">Manage your clients and schedules.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Client
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <h3 className="text-3xl font-bold">12</h3>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +2 this month
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
              <h3 className="text-3xl font-bold">4</h3>
              <p className="text-xs text-muted-foreground mt-1">Next in 45 mins</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
              <h3 className="text-3xl font-bold">7</h3>
              <p className="text-xs text-blue-600 mt-1">From 3 clients</p>
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
              <Input placeholder="Search clients..." className="pl-8 h-9" />
            </div>
          </div>

          <Card>
             <div className="p-0">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                   <tr>
                     <th className="px-6 py-3">Client</th>
                     <th className="px-6 py-3">Plan</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3">Progress</th>
                     <th className="px-6 py-3 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {clients.map((client) => (
                     <tr key={client.id} className="border-b hover:bg-muted/30 transition-colors">
                       <td className="px-6 py-4 font-medium">
                         <div className="flex items-center gap-3">
                           <Avatar className="h-8 w-8">
                             <AvatarImage src={client.img} />
                             <AvatarFallback>{client.name[0]}</AvatarFallback>
                           </Avatar>
                           <div>
                             <div className="text-foreground">{client.name}</div>
                             <div className="text-xs text-muted-foreground">{client.lastActive}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">{client.plan}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {client.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-primary rounded-full" style={{ width: `${client.progress}%` }} />
                           </div>
                           <span className="text-xs">{client.progress}%</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem>View Profile</DropdownMenuItem>
                             <DropdownMenuItem>Assign Workout</DropdownMenuItem>
                             <DropdownMenuItem>Message</DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </td>
                     </tr>
                   ))}
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
              {[
                { time: "09:00 AM", title: "Video Call with Alex", type: "Call" },
                { time: "11:00 AM", title: "PT Session - Sarah", type: "In-Person" },
                { time: "02:00 PM", title: "Update Meal Plans", type: "Admin" },
              ].map((task, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-muted-foreground w-16 pt-1">{task.time}</div>
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">{task.type}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
              <p className="text-primary-foreground/80 text-sm">
                Don't forget to check in on clients who haven't logged a workout in 3 days.
              </p>
              <Button variant="secondary" size="sm" className="mt-4 w-full">Send Check-in Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
