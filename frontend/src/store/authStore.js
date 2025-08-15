import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";


const API_URL = 'http://localhost:5000/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set , get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    message: null,
    isLoading: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/register`, { email, password, name });
            set({ user: res.data.user, isAuthenticated: true, isLoading: false });
            get().connectSocket();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                set({ error: error.response.data.message || "Error Signing Up", isLoading: false });
            }
            throw error;
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
    
            set({ user: res.data.user, isAuthenticated: true, isVerified: res.data.user, isLoading: false });
            get().connectSocket();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                set({ error: error.response.data.message || "Error logging in", isLoading: false });
            }
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
            get().disconnectSocket();

        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get(`${API_URL}/checkAuth`);
            set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
            get().connectSocket();
        } catch (error) {
            set({ error: null, isCheckingAuth: false });
            throw error;
        }
    },
    connectSocket: () => {
        const { user } = get();

        if (!user || get().socket?.connected) return;

        const socket = io(API_URL, {
            query: {
                userId: user._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
