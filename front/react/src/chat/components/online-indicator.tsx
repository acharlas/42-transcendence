import { useChat } from "../../context/chat.context";
// import {ReactComponent as Ingame} from "../../image/"

const OnlineIndicatorComponent = (props) => {
  const {
    onlineList,
  } = useChat();

  return (<>
    <div className={`menu ${onlineList.includes(props.id) ? "online" : "offline"}`}>
    </div>
    {/* <img src={ingame} alt="in game"/>
    <img src={require('../../mySvgImage.svg').default} alt='mySvgImage' /> */}
  </>);
};

export default OnlineIndicatorComponent;
