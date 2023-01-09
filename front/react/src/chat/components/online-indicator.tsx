import { useChat } from "../../context/chat.context";

const OnlineIndicatorComponent = (props) => {
  const {
    onlineList,
  } = useChat();

  return (<>
  {
    onlineList.includes(props.id)
    ?
    <div className="indicator online" title="online"></div>
    :
    <div className="indicator offline" title="offline"></div>
    // <div className="indicator ingame" title="ingame"></div>
  }
</>);
};

export default OnlineIndicatorComponent;
