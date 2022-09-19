import { Channel } from '@prisma/client';

type UserNickname = {
  users: {
    user: {
      nickname: string;
    };
    userId: string;
  }[];
};

export type MessageCont = {
  nickname: string;
  username: string;
  content: string;
};

export type GetChannelById = Channel & UserNickname;
