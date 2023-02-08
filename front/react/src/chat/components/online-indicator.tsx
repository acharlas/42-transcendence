import React from "react";

import { useChat } from "../../context/chat.context";

const Offline = <div className="indicator offline" title="offline"></div>;
const Online = <div className="indicator online" title="online"></div>;
const Ingame = <div className="indicator ingame" title="ingame"></div>;

const OnlineIndicatorComponent = (props) => {
  const { onlineList, ingameList } = useChat();
  if (onlineList?.includes(props.id)) {
    if (ingameList?.includes(props.id)) {
      return Ingame;
    }
    return Online;
  }
  return Offline;
};

export default OnlineIndicatorComponent;
