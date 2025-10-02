export interface QuestComment {
  userId: string;
  text: string;
  createdAt: string;
}

export interface Quest {
  _id: string;
  userId: {
    userId: string;
    username: string;
  };
  message: string;
  likes?: string[];
  comments?: QuestComment[];
  rankValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
