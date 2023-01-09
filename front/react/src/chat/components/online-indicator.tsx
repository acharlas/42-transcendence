import { useChat } from "../../context/chat.context";

const OnlineIndicatorComponent = (props) => {
  const {
    onlineList,
  } = useChat();

  return (<>
  {
    onlineList.includes(props.id)
    ?
    <div className="indicator online" alt="online" title="online"></div>
    :
    <div className="indicator offline" alt="offline" title="offline"></div>
    // <div className="indicator ingame" alt="ingame" title="ingame"></div>
  }
</>);
};

export default OnlineIndicatorComponent;
