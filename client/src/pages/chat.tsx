import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function ChatPage() {
  const { user, messages, addMessage, users } = useAppStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location] = useLocation();

  // Parse query params manually since wouter's useSearch isn't always available/reliable
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    if (userId) {
      setActiveChatId(userId);
    }
  }, [location]);

  // Build contact list from other users
  const contacts = users
    .filter(u => u.id !== user?.id)
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      online: true, // simplified
      img: u.avatar
    }));

  // Auto-select first contact if none selected
  useEffect(() => {
    if (!activeChatId && contacts.length > 0 && !window.location.search.includes("userId")) {
      setActiveChatId(contacts[0].id);
    }
  }, [activeChatId, contacts]);

  const activeContact = contacts.find(c => c.id === activeChatId) || users.find(u => u.id === activeChatId);
  const chatMessages = messages.filter(
    m => (m.senderId === user?.id && m.receiverId === activeChatId) || 
         (m.senderId === activeChatId && m.receiverId === user?.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: user?.id || "u1",
      receiverId: activeChatId,
      text: messageInput,
      timestamp: new Date().toISOString(),
    };

    addMessage(newMessage);
    setMessageInput("");
  };

  const handleCall = () => toast.info("Voice call feature coming soon!");
  const handleVideo = () => toast.info("Video call feature coming soon!");

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Contacts Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden border-none shadow-lg">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveChatId(contact.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    activeChatId === contact.id ? "bg-primary/10" : "hover:bg-muted"
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
                      <span className="text-[10px] text-muted-foreground uppercase">{contact.role}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Click to chat</p>
                  </div>
                </div>
              ))
            ) : (
             <div className="p-4 text-center text-sm text-muted-foreground">
               No contacts found.
             </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-card z-10">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={'img' in activeContact ? activeContact.img : activeContact.avatar} />
                  <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{activeContact.name}</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-green-600 rounded-full" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleCall}>
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleVideo}>
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
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg) => {
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
                          <div className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-primary-foreground" : "text-muted-foreground")}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <p>No messages yet.</p>
                    <p className="text-sm">Say hello! 👋</p>
                  </div>
                )}
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
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a contact to start chatting.
          </div>
        )}
      </Card>
    </div>
  );
}
