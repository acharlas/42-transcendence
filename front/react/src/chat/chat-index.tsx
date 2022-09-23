import "./chat-style.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/socket.context";
import { useChat } from "../context/chat.context";
import { Message } from "./type";
import RoomsContainer from "./Rooms";
import { FaAngleLeft } from "react-icons/fa";

export default function ChatIndex() {
  let navigate = useNavigate();
  const { socket, uid } = useContext(SocketContext).SocketState;
  const { rooms } = useChat();

  const goSignin = () => {
    window.sessionStorage.clear();
    navigate("/");
  };

  // const handleShowRoom = (event) => {
  //   showRoom ? setShowRoom(false) : setShowRoom(true);
  // };

  return (
    <div className="container">
      <button id="logout" onClick={goSignin}>
        Signout
      </button>
      <div className="chat-container">
        <></>
      </div>
    </div>
  );

  // useEffect(() => {
  //   socket.on("NewRoom", ({ newRoom }: { newRoom: Room }) => {
  //     console.log("newRoom", newRoom, "add to", rooms);
  //     setRooms([...rooms, newRoom]);
  //   });
  //   socket.on("Rooms", ({ room }: { room: Room[] }) => {
  //     console.log("Roomsssss: ", room);
  //     console.log("roomssssss: ", rooms);
  //     setRooms(room);
  //   });

  //   socket.on("JoinedRoom", ({ roomId }: { roomId: string }) => {
  //     console.log("joinedRoom");
  //     console.log("joinedRoom: ", roomId);
  //     setRoomId(roomId);
  //     const curRoom = rooms.find((room) => {
  //       room.channel.id === roomId;
  //     });
  //     setRoomShow(curRoom);
  //     setMessages(curRoom.message);
  //     setUserList(curRoom.user);
  //   });

  //   socket.on(
  //     "RoomMessage",
  //     ({ roomId, message }: { roomId: string; message: Message }) => {
  //       console.log("RoomMessage: ", { message });
  //       const curRoom = rooms.find((room) => {
  //         room.channel.id === roomId;
  //       });
  //       curRoom.message.push(message);
  //     }
  //   );

  //   socket.on("newUser", ({ roomId, user }: { roomId: string; user: User }) => {
  //     console.log("user list receive:", { user });
  //     const curRoom = rooms.find((room) => {
  //       if (room.channel.id === roomId) return true;
  //       return false;
  //     });
  //     curRoom.user.push(user);
  //   });
  //   socket.on("JoinRoom", ({ id, user }: { id: string; user: User }) => {
  //     const newUser = rooms.find((room) => {
  //       if (room.channel.id === id) return true;
  //       return false;
  //     }).user;
  //     newUser.push(user);
  //     const newRooms = rooms.map((room) => {
  //       if (room.channel.id !== id) return room;
  //       return {
  //         channel: room.channel,
  //         message: room.message,
  //         user: newUser,
  //       };
  //     });
  //     setRooms(newRooms);
  //     if (roomId === id) setUserList(newUser);
  //   });
  // });

  // return (
  //   <div className="container">
  //     <button id="logout" onClick={goSignin}>
  //       Signout
  //     </button>
  //     <div className="chat-container">
  //       <>
  //         {showRoom ? (
  //           <RoomsContainer
  //             socket={socket}
  //             setShowRoom={setShowRoom}
  //             showRoom={showRoom}
  //             setNextRoom={setNextRoom}
  //             setShowUser={setShowUser}
  //             setJoinNewRoom={setJoinNewRoom}
  //             JoinNewRoom={JoinNewRoom}
  //           />
  //         ) : (
  //           <>
  //             <button className="room-button" onClick={handleShowRoom}>
  //               <FaAngleLeft />
  //             </button>
  //           </>
  //         )}
  //         {!roomId ? (
  //           <>
  //             <ChatBodyComponent
  //               socket={socket}
  //               setNextRoom={setNextRoom}
  //               nextRoom={nextRoom}
  //               JoinNewRoom={JoinNewRoom}
  //             />
  //           </>
  //         ) : (
  //           <>
  //             {showUser ? (
  //               <UserMenu
  //                 socket={socket}
  //                 showUser={showUser}
  //                 setShowUser={setShowUser}
  //               />
  //             ) : (
  //               ""
  //             )}
  //             <MessagesContainer
  //               socket={socket}
  //               showUser={showUser}
  //               setShowUser={setShowUser}
  //             />
  //           </>
  //         )}
  //       </>
  //     </div>
  //   </div>
  // );
}
