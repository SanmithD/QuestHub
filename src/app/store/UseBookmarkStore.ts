import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { BookQuest } from "../types/quest";

interface BookMark {
  isLoading: boolean;
  booked: BookQuest[];

  bookmark: (questId: string) => void;
  getBookmarked: () => Promise<void>;
}

export const UseBookmarkStore = create<BookMark>((set, get) => ({
  isLoading: false,
  booked: [],

  bookmark: async (questId) => {
    set({ isLoading: true });
    try {
      await axios.patch(`/api/bookmarks/${questId}`, {}, { withCredentials: true });
      const currentBooked = get().booked;
      const exists = currentBooked.find((q) => q._id === questId);

      if (exists) {
        set({ booked: currentBooked.filter((q) => q._id !== questId) });
      } else {
        set({ booked: [...currentBooked, { _id: questId } as BookQuest] });
      }

      toast.success(exists ? "Bookmark removed" : "Bookmark added");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error(err.response?.data.message || "Something went wrong");
    } finally {
      set({ isLoading: false });
    }
  },

  getBookmarked: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/api/bookmarks/allBooked`, { withCredentials: true });
      set({ booked: res.data?.res || [], isLoading: false });
    } catch (error) { 
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error(err.response?.data.message || "Something went wrong");
    } finally {
      set({ isLoading: false });
    }
  },
}));
