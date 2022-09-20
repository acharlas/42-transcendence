export interface Message {
  content: string;
  username: string;
  nickname: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  user: User[];
}

export interface User {
  username: string;
  nickname: string;
  privilege: string;
}
