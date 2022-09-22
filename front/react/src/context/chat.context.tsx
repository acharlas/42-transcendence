import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message, Room, User } from "../chat/type";

interface Context {
  socket?: Socket;
  username?: string;
  setUsername: Function;
  roomId?: string;
  setRoomId: Function;
  rooms?: Room[];
  setRooms: Function;
  messages?: Message[];
  setMessages: Function;
  userList: User[];
  setUserList: Function;
  roomShow: Room;
  setRoomShow: Function;
}

const ChatContext = createContext<Context>({
  setUsername: () => false,
  setMessages: () => false,
  setRoomId: () => false,
  setRooms: () => false,
  setUserList: () => false,
  roomShow: null,
  setRoomShow: () => false,
  userList: [],
  username: "",
  messages: [],
});

function ChatProvider(props: any) {
  const [socket, setSocket] = useState<Socket>(io());
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomShow, setRoomShow] = useState<Room>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    console.log("reopen socket");
    setSocket(
      io("http://localhost:3333/chat", {
        auth: {
          token: sessionStorage.getItem("Token"),
        },
      })
    );
    return () => {
      socket.close();
      return;
    };
  }, []);

  useEffect(() => {
    socket.on("NewRoom", ({ newRoom }: { newRoom: Room }) => {
      console.log("newRoom", newRoom, "add to", rooms);
      setRooms([...rooms, newRoom]);
    });
    socket.on("Rooms", ({ room }: { room: Room[] }) => {
      console.log("Roomsssss: ", room);
      console.log("roomssssss: ", rooms);
      setRooms(room);
    });

    socket.on("JoinedRoom", ({ roomId }: { roomId: string }) => {
      console.log("joinedRoom");
      console.log("joinedRoom: ", roomId);
      setRoomId(roomId);
      const curRoom = rooms.find((room) => {
        room.channel.id === roomId;
      });
      setRoomShow(curRoom);
      setMessages(curRoom.message);
      setUserList(curRoom.user);
    });

    socket.on(
      "RoomMessage",
      ({ roomId, message }: { roomId: string; message: Message }) => {
        console.log("RoomMessage: ", { message });
        const curRoom = rooms.find((room) => {
          room.channel.id === roomId;
        });
        curRoom.message.push(message);
      }
    );

    socket.on("newUser", ({ roomId, user }: { roomId: string; user: User }) => {
      console.log("user list receive:", { user });
      const curRoom = rooms.find((room) => {
        if (room.channel.id === roomId) return true;
        return false;
      });
      curRoom.user.push(user);
    });
    socket.on("JoinRoom", ({ id, user }: { id: string; user: User }) => {
      const newUser = rooms.find((room) => {
        if (room.channel.id === id) return true;
        return false;
      }).user;
      newUser.push(user);
      const newRooms = rooms.map((room) => {
        if (room.channel.id !== id) return room;
        return {
          channel: room.channel,
          message: room.message,
          user: newUser,
        };
      });
      setRooms(newRooms);
      if (roomId === id) setUserList(newUser);
    });
  });

  return (
    <ChatContext.Provider
      value={{
        userList,
        setUserList,
        username,
        setUsername,
        rooms,
        setRooms,
        roomId,
        setRoomId,
        messages,
        setMessages,
        socket,
        setRoomShow,
        roomShow,
      }}
      {...props}
    />
  );
}

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
