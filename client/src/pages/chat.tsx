import { useState } from "react";
import { useAppStore, MOCK_MESSAGES } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { user } = useAppStore();
  const [activeChat, setActiveChat] = useState("t1"); // Default to trainer for client
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const contacts = [
    { id: "t1", name: "Coach Sarah", role: "Trainer", online: true, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
    { id: "u2", name: "Nutritionist Mike", role: "Staff", online: false, img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: user?.id || "u1",
      receiverId: activeChat,
      text: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Contacts Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden border-none shadow-lg">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {contacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  activeChat === contact.id ? "bg-primary/10" : "hover:bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.img} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-[10px] text-muted-foreground">12:30</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Great job on the workout!</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg">
        {/* Chat Header */}
        <div className="p-4 border-b flex justify-between items-center bg-card z-10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={contacts.find(c => c.id === activeChat)?.img} />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{contacts.find(c => c.id === activeChat)?.name}</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-muted/10">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex w-full",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm",
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-card text-foreground rounded-tl-none border"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={messageInput} 
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 rounded-full"
            />
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
