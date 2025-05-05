// contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { api } from "../utils/api";

// Define types
type User = {
  id: string;
  username: string;
  name: string;
};

type LoginResult = { success: true } | { success: false; message: string };
type RegisterResult = { success: true } | { success: false; message: string };

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  register: (username: string, password: string, name: string) => Promise<RegisterResult>;
  logout: () => void;
  userNames: string[];
  error: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [userNames, setUserNames] = useState<string[]>([]);

  // Check authentication status on mount and refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/get-auth');
        console.log(response.data.user, 'response.data.user');
        setUser(response.data.user);
        setError("");
      } catch (err) {
        setUser(null);
        console.error("Authentication check failed:", err);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    try {
      const response = await api.post(`/users/login`, {
        username,
        password
      });
      
      setUser(response.data.user);
      setError("");
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (username: string, password: string, name: string): Promise<RegisterResult> => {
    try {
      const response = await api.post(`/users/register`, {
        username,
        password,
        name
      });

      setUser(response.data.user);
      setError("");
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Fetch user names on mount
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await api.get(`/users/list`);
        const names = response.data.users
          .filter((u: User) => u.id !== user?.id)
          .map((u: User) => u.name);
        setUserNames(names);
      } catch (err) {
        console.error("Failed to fetch user names:", err);
      }
    };
    fetchUserNames();
  }, [user?.id]);

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, error, userNames }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
