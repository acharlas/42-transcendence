import { useNavigate } from 'react-router-dom';
import { RiShutDownLine } from 'react-icons/ri';

import './headers.css';
import { deleteRefreshToken } from '../api/refresh-api';
import { SelectedChatWindow, useChat } from "../context/chat.context";

const ChatHeaderComponent: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const {
    closeChatBox,
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
      <button onClick={selectChannels} className="bandeau-button extra-margin-left">
        channels
      </button>
      <button onClick={selectMessages} className="bandeau-button">
        messages
      </button>
      <button onClick={selectFriendlist} className="bandeau-button">
        friendlist
      </button>
      <button onClick={selectBlocklist} className="bandeau-button">
        blocklist
      </button>
      <button onClick={HandleDisconnect} className="bandeau-button margin-left no-margin-right bandeau-disconnect-button">
        <RiShutDownLine className="bandeau-disconnect-icon" />
      </button>
    </>
  );
};

export default ChatHeaderComponent;
