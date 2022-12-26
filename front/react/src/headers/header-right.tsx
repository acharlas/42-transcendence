import { useNavigate } from 'react-router-dom';
import { RiShutDownLine } from 'react-icons/ri';

import './headers.css';
import { deleteRefreshToken } from '../api/refresh-api';
import { SelectedChatWindow, useChat } from "../context/chat.context";

const ChatHeaderComponent: React.FunctionComponent = () => {
  const navigate = useNavigate();

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

  const HandleDisconnect = async () => {
    try {
      await deleteRefreshToken();
    } catch { }
    navigate('/');
  };

  return (
    <>
      <button onClick={selectChannels}
        className="headers-button extra-margin-left"
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
      <button onClick={HandleDisconnect} className="headers-button margin-left no-margin-right headers-disconnect-button">
        <RiShutDownLine className="headers-disconnect-icon" />
      </button>
    </>
  );
};

export default ChatHeaderComponent;
