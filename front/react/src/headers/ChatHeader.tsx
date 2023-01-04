import './headers.css';
import { SelectedChatWindow, useChat } from "../context/chat.context";

const ChatHeaderComponent: React.FunctionComponent = () => {
  const {
    actChannel,
    closeChatBox,
    selectedChatWindow,
    setSelectedChatWindow,
  } = useChat();

  const selectChannels = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.CHANNELS);
  };

  const selectMessages = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.MESSAGES);
  };

  const selectFriendlist = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.FRIENDLIST);
  };

  const selectBlocklist = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.BLOCKLIST);
  };

  return (
    <>
      <button onClick={selectChannels}
        className="headers-button"
        disabled={!actChannel && selectedChatWindow === SelectedChatWindow.CHANNELS}
      >
        channels
      </button>
      <button onClick={selectMessages}
        className="headers-button"
        disabled={!actChannel && selectedChatWindow === SelectedChatWindow.MESSAGES}
      >
        messages
      </button>
      <button onClick={selectFriendlist}
        className="headers-button"
        disabled={!actChannel && selectedChatWindow === SelectedChatWindow.FRIENDLIST}
      >
        friendlist
      </button>
      <button onClick={selectBlocklist}
        className="headers-button"
        disabled={!actChannel && selectedChatWindow === SelectedChatWindow.BLOCKLIST}
      >
        blocklist
      </button>
    </>
  );
};

export default ChatHeaderComponent;
