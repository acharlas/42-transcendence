import { type } from "@testing-library/user-event/dist/type";

export interface Message {
  content: string;
  username: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
}
