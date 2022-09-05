// import { useEffect, useState } from "react";
// import "./chat-style.css";
// import { io, Socket } from "socket.io-client";

// type Messages = {
//   name: string;
//   content: String;
// };

// // interface Props {
// //   socket: Socket;
// //   message: Messages[];
// // }

// /*class Display extends Component<Props> {
//   props: Props = {};
//   public renderRows = () => {};
// }*/

// const Message = (props: { message: Messages[] }): JSX.Element => {
//   const message = props.message;
//   console.log("aff msg", { message });
//   return (
//     <div>
//       <p>aloool</p>
//       {Array.from(message).map((elem, index) => {
//         return <p key={index}>{elem.name + ": " + elem.content}</p>;
//       })}
//     </div>
//   );
// };

// export default function Chat() {
//   const [socket, setSocket] = useState(io("http://localhost:3333"));
//   //const [isTyping, setTyping] = useState(false);
//   const [messages, setMessages] = useState<Messages[]>([]);

//   useEffect(() => {
//     setSocket(io("http://localhost:3333"));
//   }, []);

//   useEffect(() => {
//     const fetchMessage = async (): Promise<void> => {
//       console.log("old msg", { messages });
//       socket.emit("findAllMessages", {}, (response: Messages[]) => {
//         console.log({ response });
//         setMessages({ ...messages });
//         return;
//       });
//       await fetchMessage();
//       console.log("new msg", { messages });
//     };
//   }, [socket]);

//   //   const click = () => {
//   //     // console.log("click");
//   //     socket.emit("findAllMessages", (response) => {
//   //       // console.log("response", { response });
//   //       setMessages(response);
//   //     });
//   //   };

//   const handleClick = (socket: Socket) => {
//     socket.emit("findAllMessages", (res: Messages[]) => {
//       setMessages({ ...res });
//     });
//   };
//   const msgProps = {
//     message: messages,
//   };
//   return (
//     <div className="container">
//       <div className="screen">
//         <Message {...msgProps} />
//       </div>
//       <button onClick={() => handleClick(socket)}>Messages</button>
//     </div>
//   );
// }

import SocketProvider from "../context/chat.context";
import Home from "./chat-index";

function Chat({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Home {...pageProps} />
    </SocketProvider>
  );
}

export default Chat;
