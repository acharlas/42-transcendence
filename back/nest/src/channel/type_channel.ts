import {
  Channel,
  ChannelType,
  UserPrivilege,
  UserStatus,
} from '@prisma/client';

type UserNickname = {
  users: {
    user: {
      nickname: string;
    };
    userId: string;
  }[];
};

export type ChannelCont = {
  id: string;
  name: string;
  type: ChannelType;
};

export type MessageCont = {
  content: string;
  username: string;
};

export type User = {
  username: string;
  nickname: string;
  id: string;
  privilege: UserPrivilege;
  status: UserStatus;
};

export type Room = {
  channel: ChannelCont;
  user: User[];
  message: MessageCont[];
};

export type GetChannelById = Channel & UserNickname;
