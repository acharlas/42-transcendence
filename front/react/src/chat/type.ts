export interface Message {
  content: string;
  username: string;
}

export enum UserStatus {
  connected = "connected",
  disconnected = "disconnected",
  invited = "invited",
}

export enum ConnectionStatus {
  offline = "offline",
  online = "online",
  ingame = "ingame",
}

export enum ChannelType {
  public = "public",
  private = "private",
  protected = "protected",
  dm = "dm",
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
  newMessage: boolean;
}

export interface User {
  username: string;
  nickname: string;
  id: string;
  privilege: UserPrivilege;
  status: UserStatus;
  connectionStatus: ConnectionStatus;
}
