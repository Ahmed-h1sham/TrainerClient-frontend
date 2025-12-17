import { create } from "zustand";

// Types
export type UserRole = "client" | "trainer";

export interface User {
  id: string;
  name: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
  goals?: string[];
  metrics?: {
    height: number; // cm
    weight: number; // kg
    age: number;
  };
  nutritionTargets?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  date: string; // ISO date
  status: "pending" | "completed" | "missed";
  exercises: {
    name: string;
    sets: number;
    reps: string;
    weight?: string;
    rest?: string;
  }[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: "workout" | "call" | "reminder";
  time: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

// Mock Data
export const CURRENT_USER: User = {
  id: "u1",
  name: "Alex Client",
  email: "alex@example.com",
  studentNumber: "12345678",
  role: "client",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
  goals: ["Build Muscle", "Improve Stamina"],
  metrics: {
    height: 180,
    weight: 75,
    age: 28
  },
  nutritionTargets: {
    calories: 2400,
    protein: 160,
    carbs: 250,
    fats: 70
  }
};

export const TRAINER_USER: User = {
  id: "t1",
  name: "Coach Sarah",
  email: "sarah@trainio.com",
  role: "trainer",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
};

export const MOCK_CLIENTS: User[] = [
  {
    id: "u1",
    name: "Alex Client",
    email: "alex@example.com",
    role: "client",
    studentNumber: "12345678",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    goals: ["Build Muscle", "Improve Stamina"],
    metrics: { height: 180, weight: 75, age: 28 },
    nutritionTargets: { calories: 2400, protein: 160, carbs: 250, fats: 70 }
  },
  {
    id: "u2",
    name: "Emma Watson",
    email: "emma@example.com",
    role: "client",
    studentNumber: "87654321",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    goals: ["Weight Loss", "Flexibility"],
    metrics: { height: 165, weight: 60, age: 25 },
    nutritionTargets: { calories: 1800, protein: 120, carbs: 200, fats: 50 }
  }
];

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1",
    userId: "u1",
    title: "Upper Body Power",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "60kg", rest: "90s" },
      { name: "Pull Ups", sets: 3, reps: "Max", rest: "60s" }
    ]
  },
  {
    id: "w2",
    userId: "u1",
    title: "Leg Day",
    date: "2023-10-20",
    status: "completed",
    exercises: [
      { name: "Squats", sets: 4, reps: "10", weight: "80kg", rest: "120s" }
    ]
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "u1",
    receiverId: "t1",
    text: "Hey coach, I'm feeling great after yesterday's workout!",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "m2",
    senderId: "t1",
    receiverId: "u1",
    text: "Awesome to hear! Keep up the momentum.",
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

// Store
interface AppState {
  user: User | null;
  clients: User[]; // Mock database of clients
  users: User[]; // All users (trainers + clients)
  workouts: Workout[];
  messages: Message[];
  events: Event[];
  meals: Meal[];

  setWorkouts: (workouts: Workout[]) => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateClientNutrition: (clientId: string, calories: number, protein: number, carbs: number, fats: number) => void;
  isTrainer: boolean;
  
  addClient: (client: User) => void;
  assignWorkout: (clientId: string, workout: Workout) => void;
  completeWorkout: (workoutId: string) => void;
  logWeight: (weight: number) => void;
  
  addMessage: (message: Message) => void;
  addEvent: (event: Event) => void;
  addMeal: (meal: Meal) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null, 
  isTrainer: false,
  clients: MOCK_CLIENTS,
  users: [CURRENT_USER, TRAINER_USER, ...MOCK_CLIENTS.filter(c => c.id !== CURRENT_USER.id)],
  workouts: MOCK_WORKOUTS,
  messages: MOCK_MESSAGES,
  events: [
    { id: "e1", title: "Consultation Call", date: new Date().toISOString().split('T')[0], type: "call", time: "10:00 AM" },
    { id: "e2", title: "Review Emma's Progress", date: new Date().toISOString().split('T')[0], type: "reminder", time: "02:00 PM" }
  ],
  meals: [],
  
  setUser: (user) => set({ user, isTrainer: user?.role === "trainer" }),
  
  updateUser: (updates) => set((state) => {
    if (!state.user) return {};
    const updatedUser = { ...state.user, ...updates };
    // Also update in users list and clients list if applicable
    const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    const updatedClients = state.clients.map(c => c.id === updatedUser.id ? updatedUser : c);
    return { user: updatedUser, users: updatedUsers, clients: updatedClients };
  }),

  updateClientNutrition: (clientId, calories, protein, carbs, fats) => set((state) => {
    // Find client and update their nutrition targets
    const updatedClients = state.clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          nutritionTargets: { calories, protein, carbs, fats }
        };
      }
      return client;
    });
    
    // Also update users array
    const updatedUsers = state.users.map(user => {
       if (user.id === clientId) {
        return {
          ...user,
          nutritionTargets: { calories, protein, carbs, fats }
        };
       }
       return user;
    });

    // If current user is the one being updated
    let updatedUser = state.user;
    if (state.user && state.user.id === clientId) {
      updatedUser = { ...state.user, nutritionTargets: { calories, protein, carbs, fats } };
    }

    return { clients: updatedClients, users: updatedUsers, user: updatedUser };
  }),

  setWorkouts: (workouts) => set({ workouts }),

  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client],
    users: [...state.users, client] 
  })),

  assignWorkout: (clientId, workout) => set((state) => ({ 
    workouts: [...state.workouts, { ...workout, userId: clientId }] 
  })),

  completeWorkout: (workoutId) => set((state) => ({
    workouts: state.workouts.map(w => w.id === workoutId ? { ...w, status: "completed" } : w)
  })),

  logWeight: (weight) => set((state) => {
    if (!state.user || !state.user.metrics) return {};
    return {
      user: {
        ...state.user,
        metrics: { ...state.user.metrics, weight }
      }
    };
  }),

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  addEvent: (event) => set((state) => ({ 
    events: [...state.events, event] 
  })),

  addMeal: (meal) => set((state) => ({ 
    meals: [...state.meals, meal] 
  }))
}));

