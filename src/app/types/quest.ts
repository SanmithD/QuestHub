
export type QuestUser = {
  _id: string;
  username: string;
};

export interface QuestComment {
  _id: string;
  userId: QuestUser;
  length?: number;
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

export interface BookQuestId{
  _id: string;
  message: string;
  likes?: string[];
  comments?: QuestComment[];
  rankValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookQuest {
  questId: BookQuestId;
  _id: string;
  userId: {
    userId: string;
    username: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserQuestType{
  message: string;
  likes?: string[];
  comments?: QuestComment[];
  rankValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string; 
  _id: string;
}