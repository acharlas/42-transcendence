import { GoThumbsdown } from "react-icons/go";
import { FaSadCry, FaTrophy } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

import "./game-recap.css";
import Avatar from "../avatar/avatar_component";
import { useContext } from "react";
import { useGame } from "../context/game.context";

export default function GameRecap() {
  const { lobby } = useGame();

  const wName: string = lobby.game.score[0] > lobby.game.score[1] ? lobby.playerOne.nickname : lobby.playerTwo.nickname;
  const lName: string = lobby.game.score[0] < lobby.game.score[1] ? lobby.playerOne.nickname : lobby.playerTwo.nickname;
  const wId: string = lobby.game.score[0] > lobby.game.score[1] ? lobby.playerOne.id : lobby.playerTwo.id;
  const lId: string = lobby.game.score[0] < lobby.game.score[1] ? lobby.playerOne.id : lobby.playerTwo.id;
  const wScore: number = lobby.game.score[0] > lobby.game.score[1] ? lobby.game.score[0] : lobby.game.score[1];
  const lScore: number = lobby.game.score[0] > lobby.game.score[1] ? lobby.game.score[0] : lobby.game.score[1];

  return (
    <>
      <div className="panel__row">
        <div className="half-width">
          <div className="game-recap-top game-recap-win">
            <div className="game-recap-name">{wName}</div>
          </div>
          <div className="game-recap-middle rm__avatar__padding">
            <div className="profile__avatar__container">{Avatar(wId, "game-recap-avatar")}</div>
          </div>
          <div className="game-recap-bottom game-recap-win">
            <div className="game-recap-score">
              <HiTrendingUp />
              {wScore}
              <FaTrophy />
            </div>
          </div>
        </div>
        <div className="half-width">
          <div className="game-recap-top game-recap-loss">
            <div className="game-recap-name">{lName}</div>
          </div>
          <div className="game-recap-middle rm__avatar__padding">
            <div className="profile__avatar__container">{Avatar(lId, "game-recap-avatar")}</div>
          </div>
          <div className="game-recap-bottom game-recap-loss">
            <div className="game-recap-score">
              <GoThumbsdown />
              {lScore}
              <FaSadCry />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
