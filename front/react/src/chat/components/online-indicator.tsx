import React, { useEffect, useState } from "react";
import axios from "axios";

import { useChat } from "../../context/chat.context";

const Offline = <div className="indicator offline" title="offline"></div>;
const Online = <div className="indicator online" title="online"></div>;
const Ingame = <div className="indicator ingame" title="ingame"></div>;

const OnlineIndicatorComponent = (props) => {
  const { onlineList } = useChat();
  const [ingame, setIngame] = useState<boolean>(false);

  //periodically check user status
  const getStatus = async () => {
    try {
      const userIsIngame = await axios.get("http://localhost:3333/status/ingame/" + props.id);
      console.log(userIsIngame?.data);
      setIngame(userIsIngame?.data);
    } catch (err) {
      console.error(err?.message);
    }
  };

  const OnlineOrIngame = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        getStatus();
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return ingame ? Ingame : Online;
  };

  if (onlineList?.includes(props.id)) return OnlineOrIngame();
  return Offline;
};

export default OnlineIndicatorComponent;
