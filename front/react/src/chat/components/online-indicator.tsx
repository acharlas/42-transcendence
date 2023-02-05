import React, { useEffect, useState } from "react";
import axios from "axios";

import { useChat } from "../../context/chat.context";

const Offline = <div className="indicator offline" title="offline"></div>;
const Online = <div className="indicator online" title="online"></div>;
const Ingame = <div className="indicator ingame" title="ingame"></div>;

const IngameOrOnlineComponent = (id: string) => {
  const [ingame, setIngame] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      getStatus().then((data) => {
        setIngame(data);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //periodically check user status
  const getStatus = async () => {
    try {
      const userIsIngame = await axios.get("http://localhost:3333/status/ingame/" + id);
      console.log(userIsIngame?.data);
      return userIsIngame?.data;
    } catch (err) {
      console.error(err?.message);
    }
  };

  return ingame ? Ingame : Online;
};

const OnlineIndicatorComponent = (props) => {
  const { onlineList } = useChat();
  if (onlineList?.includes(props.id)) return IngameOrOnlineComponent(props.id);
  return Offline;
};

export default OnlineIndicatorComponent;
