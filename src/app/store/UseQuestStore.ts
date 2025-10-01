import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export type QuestDetails = {
    _id?: string;
    questId?: string;
    message: string;
    userId?: string;
    comment?: [];
    createdAt?: Date;
    updatedAt?: Date;
    likes?: string;
    rankValue?: string;
}

interface Quest{
    isLoading: boolean;
    quests: QuestDetails[] | null;

    postQuest: (data: string) => Promise<void>;
    getAllQuests: (page: string, limit: string) =>Promise<void>;
    getQuestById: (questId: string) => Promise<void>;
    deleteQuest: (questId: string) => Promise<void>;
    updateQuest: (questId: string) => Promise<void>;
    postComment: (questId: string, data: string) => Promise<void>;
    postLike: (questId: string) => Promise<void>;
    postRank: (questId: string) => Promise<void>;
}

export const UseQuestStore = create<Quest>((set, get) =>({
    isLoading: false,
    quests: null,

    postQuest: async(data) =>{
        set({ isLoading: true });
        try {
            await axios.post(`/api/quest`,{data},{ withCredentials: true });
            set({ isLoading: false });
            await get().getAllQuests("1","10");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    getAllQuests: async(page, limit) =>{
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/quest?page=${page}&limit=${limit}`,{ withCredentials: true });
            console.log(res.data?.res);
            set({ isLoading: false, quests: res.data?.res });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    getQuestById: async(questId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/quest/${questId}`,{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    deleteQuest: async(questId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.delete(`/api/quest/${questId}`,{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    updateQuest: async(questId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.put(`/api/quest/${questId}`,{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    postComment: async(questId, data) =>{
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/quest/${questId}/comment`,{data},{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    postLike: async(questId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.patch(`/api/quest/${questId}/like`,{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    postRank: async(questId) =>{
        set({ isLoading: true });
        try {
            const res = await axios.patch(`/api/quest/${questId}/rank`,{ withCredentials: true });
            console.log(res.data);
            set({ isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.log(error);
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
}))