export interface QuestComment {
  userId: string;
  username: string;
  message: string;
  createdAt?: Date;
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
