import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { QuestComment } from "../types/quest";
import { UseAuthStore } from "./UseAuthStore";

export type UserDetails = {
  email: string;
  username?: string;
  userId: string;
  message: string;
};

export type QuestDetails = {
  _id: string;
  questId?: string;
  message: string;
  userId?: UserDetails;
  comment?: QuestComment;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: string[];
  rankValue?: number;
};

interface Quest {
  isLoading: boolean;
  isCommentLoading: boolean;
  currentQuest?: QuestDetails | null;
  quests: QuestDetails[] | null;
  comments?: QuestComment[] | null;

  postQuest: (data: string) => Promise<void>;
  getAllQuests: (page: number, limit: number) => Promise<void>;
  getQuestById: (questId: string) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  updateQuest: (questId: string, message: string) => Promise<void>;
  postComment: (questId: string, data: string) => Promise<void>;
  postLike: (questId: string) => Promise<void>;
  fetchComments: (questId: string, limit: number) => Promise<void>;
  postRank: (questId: string, rankValue: number) => Promise<void>;

  updateQuestOptimistically: (
    questId: string,
    updates: Partial<QuestDetails>
  ) => void;
}

export const UseQuestStore = create<Quest>((set, get) => ({
  isLoading: false,
  quests: null,
  comments: null,
  isCommentLoading: false,

  updateQuestOptimistically: (questId, updates) => {
    const currentQuests = get().quests;
    if (!currentQuests) return;

    const updatedQuests = currentQuests.map((quest) =>
      quest._id === questId ? { ...quest, ...updates } : quest
    );
    set({ quests: updatedQuests });
  },

  postQuest: async (data) => {
    set({ isLoading: true });
    try {
      await axios.post(`/api/quest`, { data }, { withCredentials: true });
      set({ isLoading: false });
      await get().getAllQuests(1, 10);
      await UseAuthStore.getState().getUserQuest();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  getAllQuests: async (page, limit) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/api/quest?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      set({ isLoading: false, quests: res.data?.res });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  getQuestById: async (questId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/api/quest/${questId}`, {
        withCredentials: true,
      });
      set({ isLoading: false, currentQuest: res.data?.quest });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  deleteQuest: async (questId) => {
    set({ isLoading: true });
    try {
      const res = await axios.delete(`/api/quest/${questId}`, {
        withCredentials: true,
      });
      console.log(res.data);
      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  updateQuest: async (questId, message) => {
    set({ isLoading: true });
    try {
      await axios.put(`/api/quest/${questId}`, { message }, {
        withCredentials: true,
      });
      set({ isLoading: false });
      await UseAuthStore.getState().getUserQuest();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  postComment: async (questId, comment) => {
    set({ isLoading: true });
    try {
      await axios.patch(
        `/api/quest/${questId}/comment`,
        { comment },
        { withCredentials: true }
      );
      set({ isLoading: false });
      await get().fetchComments(questId, 10);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  fetchComments: async (questId, limit) => {
    set({ isCommentLoading: true });
    try {
      const res = await axios.get(
        `/api/quest/${questId}/comment?limit=${limit}`,
        { withCredentials: true }
      );
      set({ isCommentLoading: false, comments: res.data?.comments });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      set({ isCommentLoading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  postLike: async (questId) => {
    const currentQuests = get().quests;
    if (!currentQuests) return;

    const currentQuest = currentQuests.find((q) => q._id === questId);
    if (!currentQuest) return;

    const getCurrentUserId = () => {
      return "current_user_id";
    };

    const currentUserId = getCurrentUserId();
    const currentLikes = currentQuest.likes || [];
    const isLiked = currentLikes.includes(currentUserId);

    const optimisticLikes = isLiked
      ? currentLikes.filter((id) => id !== currentUserId)
      : [...currentLikes, currentUserId];

    get().updateQuestOptimistically(questId, { likes: optimisticLikes });

    try {
      const res = await axios.patch(
        `/api/quest/${questId}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data?.quest?.likes) {
        get().updateQuestOptimistically(questId, {
          likes: res.data.quest.likes,
        });
      }
    } catch (err) {
      get().updateQuestOptimistically(questId, { likes: currentLikes });

      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  postRank: async (questId: string, rankValue: number) => {
    const currentQuests = get().quests;
    if (!currentQuests) return;

    const currentQuest = currentQuests.find((q) => q._id === questId);
    if (!currentQuest) return;

    get().updateQuestOptimistically(questId, { rankValue });

    try {
      const res = await axios.patch(
        `/api/quest/${questId}/rank`,
        { rankValue },
        { withCredentials: true }
      );

      if (res.data?.quest?.rankValue !== undefined) {
        get().updateQuestOptimistically(questId, {
          rankValue: res.data.quest.rankValue,
        });
      }
    } catch (err) {
      get().updateQuestOptimistically(questId, {
        rankValue: currentQuest.rankValue,
      });

      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
}));
