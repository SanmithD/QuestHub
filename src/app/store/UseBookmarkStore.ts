import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface BookMark {
  isLoading: boolean;
  booked: Record<string, boolean>;

  bookmark: (id: string) => Promise<void>;
  getBookmarked: () => Promise<void>;
}

export const UseBookmarkStore = create<BookMark>((set) => ({
  isLoading: false,
  booked: {},

  bookmark: async (questId) => {
    set({ isLoading: true });
    try {
      const res = await axios.patch(`/api/bookmarks/${questId}`, {}, { withCredentials: true });

      set((state) => ({
        booked: {
          ...state.booked,
          [questId]: res?.status === 201,
        },
      }));
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
      const res = await axios.get(`/api/bookmarks`, { withCredentials: true });
      // assuming res.data.bookmarks is an array of questIds
      const bookmarkedMap: Record<string, boolean> = {};
      res.data.bookmarks.forEach((id: string) => {
        bookmarkedMap[id] = true;
      });
      set({ booked: bookmarkedMap });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error(err.response?.data.message || "Something went wrong");
    } finally {
      set({ isLoading: false });
    }
  },
}));
