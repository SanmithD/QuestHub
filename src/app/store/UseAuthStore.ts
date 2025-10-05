import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { UserQuestType } from "../types/quest";

type UserDetails ={
    userId?: string;
    username?: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthDetails{
    isLoading: boolean;
    isQuestLoading: boolean;
    auth: UserDetails | null;
    status: boolean;
    userQuest: UserQuestType[];
    signup: (data: UserDetails) => Promise<void>;
    login: (data: UserDetails) => Promise<void>;
    deleteAccount: () => Promise<void>;
    updateAccount: (data: string) => Promise<void>;
    profile: () => Promise<void>;
    getProfile: (userId: string) => Promise<void>;
    getUserQuest: () =>Promise<void>;
}

export const UseAuthStore = create<AuthDetails>((set, get) =>({
    isLoading: false,
    auth: null,
    isQuestLoading: false,
    status: false,
    userQuest: [],

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
        set({ isLoading: true });
        try {
            await axios.delete(`/api/user/profile`,{ withCredentials: true });
            set({ auth: null, isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isLoading: false });
        }
    },

    updateAccount: async(data) =>{
        set({ isLoading: true });
        try {
            await axios.put(`/api/user/profile`,{data}, { withCredentials: true });
            set({ isLoading: false });
            await get().profile();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isLoading: false });
        }
    },
    profile: async() =>{
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/user/profile`,{ withCredentials: true });
            set({ auth: res.data?.res, isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isLoading: false });
        }
    },

    getUserQuest: async() =>{
        set({ isQuestLoading: true });
        try {
            const res = await axios.get(`/api/user/profile/quest`,{ withCredentials: true });
            set({ userQuest: res.data?.res, isQuestLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isQuestLoading: false });
        }
    },

    getProfile: async(userId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/user/profile`,{ withCredentials: true });
            console.log(res.data);
            set({ auth: res.data?.res, isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isLoading: false });
        }
    }
}))