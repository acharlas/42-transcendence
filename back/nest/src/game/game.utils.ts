import { Lobby } from './types_game';

export const PlayerIsInLobby = (userId: string, lobby: Lobby) => {
  if (lobby && (lobby.playerOne === userId || lobby.playerTwo === userId)) return true;
  return false;
};

export const PlayerIsInWatching = (userId: string, lobby: Lobby) => {
  return (
    lobby &&
    lobby.viewer.find((viewer) => {
      if (viewer === userId) return true;
      return false;
    })
  );
};
