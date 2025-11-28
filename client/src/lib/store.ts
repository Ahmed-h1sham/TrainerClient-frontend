import { create } from "zustand";

// Types
export type UserRole = "client" | "trainer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  goals?: string[];
  metrics?: {
    height: number; // cm
    weight: number; // kg
    age: number;
  };
}

export interface Workout {
  id: string;
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

// Mock Data
export const CURRENT_USER: User = {
  id: "u1",
  name: "Alex Client",
  email: "alex@example.com",
  role: "client",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
  goals: ["Build Muscle", "Improve Stamina"],
  metrics: {
    height: 180,
    weight: 75,
    age: 28
  }
};

export const TRAINER_USER: User = {
  id: "t1",
  name: "Coach Sarah",
  email: "sarah@trainio.com",
  role: "trainer",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
};

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1",
    title: "Upper Body Power",
    date: new Date().toISOString().split('T')[0], // Today
    status: "pending",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "60kg", rest: "90s" },
      { name: "Pull Ups", sets: 3, reps: "Max", rest: "60s" },
      { name: "Shoulder Press", sets: 3, reps: "12", weight: "20kg", rest: "60s" }
    ]
  },
  {
    id: "w2",
    title: "Leg Day",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    status: "pending",
    exercises: [
      { name: "Squats", sets: 5, reps: "5", weight: "100kg", rest: "120s" },
      { name: "Lunges", sets: 3, reps: "12/leg", weight: "20kg", rest: "60s" }
    ]
  },
  {
    id: "w3",
    title: "Cardio & Core",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    status: "completed",
    exercises: [
      { name: "Treadmill Run", sets: 1, reps: "20 mins", rest: "0" },
      { name: "Plank", sets: 3, reps: "60s", rest: "30s" }
    ]
  }
];

export const MOCK_MESSAGES: Message[] = [
  { id: "m1", senderId: "t1", receiverId: "u1", text: "Hey Alex! How was the workout yesterday?", timestamp: new Date(Date.now() - 10000000).toISOString() },
  { id: "m2", senderId: "u1", receiverId: "t1", text: "It was intense! Loved the core finisher.", timestamp: new Date(Date.now() - 9000000).toISOString() },
  { id: "m3", senderId: "t1", receiverId: "u1", text: "Great to hear. I've updated your plan for next week.", timestamp: new Date(Date.now() - 8000000).toISOString() },
];

// Store
interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isTrainer: boolean;
}

export const useAppStore = create<AppState>((set) => ({
  user: null, // Start logged out for demo
  isTrainer: false,
  setUser: (user) => set({ user, isTrainer: user?.role === "trainer" }),
}));
