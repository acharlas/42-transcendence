export interface Message {
  content: string;
  username: string;
}

export enum ChannelType {
  public,
  private,
  protected,
  dm,
}

export enum UserPrivilege {
  owner = "owner",
  admin = "admin",
  default = "default",
  muted = "muted",
  ban = "ban",
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
}

export interface Room {
  channel: Channel;
  user: User[];
  message: Message[];
}

export interface User {
  username: string;
  nickname: string;
  privilege: UserPrivilege;
}
