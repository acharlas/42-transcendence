import { createContext, useContext, useState } from "react";

export interface GlobalContextState {
  userid: string,
  setUserid: Function,
  username: string,
  setUsername: Function,
  nickname: string,
  setNickname: Function,
  blocklist: [],
  setBlocklist: Function,
  friendlist: [],
  setFriendlist: Function,
}

const GlobalContext = createContext<GlobalContextState>({
  userid: "",
  setUserid: () => { },
  username: "",
  setUsername: () => { },
  nickname: "",
  setNickname: () => { },
  blocklist: [],
  setBlocklist: () => { },
  friendlist: [],
  setFriendlist: () => { },
});

function GlobalProvider(props: any) {
  const [userid, setUserid] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [blocklist, setBlocklist] = useState<[]>([]);
  const [friendlist, setFriendlist] = useState<[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        userid, setUserid,
        username, setUsername,
        nickname, setNickname,
        blocklist, setBlocklist,
        friendlist, setFriendlist,
      }}
      {...props}
    />
  );
}

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
