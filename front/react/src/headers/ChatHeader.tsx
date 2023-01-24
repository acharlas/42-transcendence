import { FaExclamation } from 'react-icons/fa';

import './headers.css';
import { SelectedChatWindow, useChat } from "../context/chat.context";

const ChatHeaderComponent: React.FunctionComponent = () => {
  const {
    actChannel,
    closeChatBox,
    selectedChatWindow,
    setSelectedChatWindow,
    hasNewInvite,
    hasNewChatMessage,
    hasNewChannelMessage,
    setHasNewInvite,
    setHasNewChatMessage,
    setHasNewChannelMessage,
  } = useChat();

  const selectChannels = () => {
    closeChatBox();
    setHasNewChannelMessage(false);
    setSelectedChatWindow(SelectedChatWindow.CHANNELS);
  };

  const selectMessages = () => {
    closeChatBox();
    setHasNewChatMessage(false);
    setSelectedChatWindow(SelectedChatWindow.MESSAGES);
  };

  const selectInvites = () => {
    closeChatBox();
    setHasNewInvite(false);
    setSelectedChatWindow(SelectedChatWindow.INVITES);
  };

  const selectFriendlist = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.FRIENDLIST);
  };

  const selectBlocklist = () => {
    closeChatBox();
    setSelectedChatWindow(SelectedChatWindow.BLOCKLIST);
  };

  return (<>
    <button onClick={selectChannels}
      className="headers-button"
      disabled={!actChannel && selectedChatWindow === SelectedChatWindow.CHANNELS}
    >
      channels
      {hasNewChannelMessage && <FaExclamation />}
    </button>

    <button
      onClick={selectMessages}
      className="headers-button"
      disabled={!actChannel && selectedChatWindow === SelectedChatWindow.MESSAGES}
    >
      messages
      {hasNewChatMessage && <FaExclamation />}
    </button>

    <button onClick={selectInvites}
      className="headers-button"
      disabled={!actChannel && selectedChatWindow === SelectedChatWindow.INVITES}
    >
      invites
      {hasNewInvite && <FaExclamation />}
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
  </>);
};

export default ChatHeaderComponent;
