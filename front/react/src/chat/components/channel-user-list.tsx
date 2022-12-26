import { FaBan } from 'react-icons/fa';
import { GiRank1, GiRank2, GiRank3 } from 'react-icons/gi';
import { HiVolumeOff } from 'react-icons/hi';

import { Room, User, UserStatus, UserPrivilege } from '../type';
import { useChat } from '../../context/chat.context';

function ChannelUserListComponent(room: Room) {
  const {
    setSelectUser,
    selectUser,
    user,
  } = useChat();

  const handleSelectUser = (user: User) => {
    if (selectUser?.username === user.username)
      setSelectUser(undefined);
    else setSelectUser(user);
  };

  return (<>
    <div className="profile__panel__top">
      User list
    </div>
    <div className="profile__panel__bottom">
      <ul>
        {room.user.map((actUser, id) => {
          if (((actUser.status === UserStatus.connected) || actUser.privilege === UserPrivilege.ban))
            return (
              <li key={id}>
                <button
                  className="chan-list-button"
                  onClick={() => { handleSelectUser(actUser); }}
                  disabled={user.username === actUser.username}
                >
                  {actUser.privilege === UserPrivilege.owner && (<GiRank3 className="room-menu-user-icon" />)}
                  {actUser.privilege === UserPrivilege.admin && (<GiRank2 className="room-menu-user-icon" />)}
                  {actUser.privilege === UserPrivilege.default && (<GiRank1 className="room-menu-user-icon" />)}
                  {actUser.privilege === UserPrivilege.ban && (<FaBan className="room-menu-user-icon" />)}
                  {actUser.privilege === UserPrivilege.muted && (<HiVolumeOff className="room-menu-user-icon" />)}
                  {actUser.nickname}
                </button>
              </li>
            );
          return null;
        })}
      </ul>
    </div>
  </>);
}

export default ChannelUserListComponent;
