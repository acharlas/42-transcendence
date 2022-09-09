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
  username: string;
  content: string;
};

export type GetChannelById = Channel & UserNickname;
