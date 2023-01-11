import { Lobby } from './types_game';

const PlayerIsInLobby = (userId: string, lobby: Lobby) => {
  if (lobby && (lobby.playerOne === userId || lobby.playerTwo === userId))
    return true;
  return false;
};

export default PlayerIsInLobby;
