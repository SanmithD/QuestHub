import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

type UserDetails ={
    userId?: string;
    username?: string;
    email: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string
}

interface AuthDetails{
    isLoading: boolean;
    auth: UserDetails | null;
    status: boolean;
    signup: (data: UserDetails) => Promise<void>;
    login: (data: UserDetails) => Promise<void>;
    deleteAccount: () => Promise<void>;
    updateAccount: () => Promise<void>;
    profile: () => Promise<void>;
    getProfile: (userId: string) => Promise<void>;
}

export const UseAuthStore = create<AuthDetails>((set) =>({
    isLoading: false,
    auth: null,
    status: false,

    signup: async(data) =>{
        set({ isLoading: true });
        try {
            await axios.post(`/api/user/signup`,data);
            set({ isLoading: false, status: true });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            set({ isLoading: false, status: false })
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    },

    login: async(data) =>{
        set({ isLoading: true });
        try {
            await axios.post(`/api/user/login`,data);
            set({ isLoading: false, status: true });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            set({ isLoading: false, status: false })
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    },
    deleteAccount: async() =>{

    },
    updateAccount: async() =>{

    },
    profile: async() =>{

    },
    getProfile: async(id) =>{

    },
}))