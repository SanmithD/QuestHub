import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { HistoryType } from "../types/quest";
import { QuestDetails } from "./UseQuestStore";

interface SearchDetails {
  isSearchLoading: boolean;
  history: HistoryType[];
  quests: QuestDetails[];

  fetchHistory: (limit: number) => Promise<void>;
  saveHistory: (id: string) => Promise<void>;
  searchQuest: (query: string, limit: number) => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
}

export const UseSearchStore = create<SearchDetails>((set, get) => ({
  isSearchLoading: false,
  history: [],
  quests: [],

  fetchHistory: async (limit) => {
    set({ isSearchLoading: true });
    try {
      const res = await axios.get(`/api/search/history?limit=${limit}`, {
        withCredentials: true,
      });
      console.log(res.data)
      set({ history: res.data?.res || [], isSearchLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ isSearchLoading: false });
      toast.error(err.response?.data.message || "Something went wrong");
    }
  },

  saveHistory: async (id) => {
    set({ isSearchLoading: true });
    try {
      await axios.post(`/api/search/${id}`, {}, { withCredentials: true });
      set({ isSearchLoading: false });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ isSearchLoading: false });
      toast.error(err.response?.data.message || "Something went wrong");
    }
  },

  searchQuest: async (query, limit) => {
    set({ isSearchLoading: true });
    try {
      const res = await axios.get(
        `/api/search/?query=${encodeURIComponent(query)}&limit=${limit}`,
        { withCredentials: true }
      );
      set({ quests: res.data?.res || [], isSearchLoading: false });
      console.log(res.data)
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ isSearchLoading: false });
      toast.error(err.response?.data.message || "Something went wrong");
    }
  },

  removeHistory: async(id) =>{
    set({ isSearchLoading: true });
    try {
      await axios.delete(
        `/api/search/${id}`,
        { withCredentials: true }
      );
      set({ isSearchLoading: false });
      await get().fetchHistory(10);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({ isSearchLoading: false });
      toast.error(err.response?.data.message || "Something went wrong");
    }
  }
}));
