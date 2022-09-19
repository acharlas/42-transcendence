import { type } from "@testing-library/user-event/dist/type";

export interface Message {
  content: string;
  username: string;
  nickname: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
}

export interface User {
  username: string;
  nickname: string;
}
