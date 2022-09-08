import { type } from "@testing-library/user-event/dist/type";

export interface Message {
  message: string;
  username: string;
  time: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
}
