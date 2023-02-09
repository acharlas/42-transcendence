import { GoThumbsdown } from "react-icons/go";
import { FaSadCry, FaTrophy } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./game-recap.css";
import Avatar from "../avatar/avatar_component";
import { useGame } from "../context/game.context";

export default function GameRecap() {
  const { history, setLobby } = useGame();
  let navigate = useNavigate();
  useEffect(() => {
    if (!history) {
      navigate("/app");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLobby(null);
  });

  const wName: string = history.score.find((player) => {
    return player.placement === 1;
  }).nickName;
  const lName: string = history.score.find((player) => {
    return player.placement === 2;
  }).nickName;
  const wId: string = history.score.find((player) => {
    return player.placement === 1;
  }).id;
  const lId: string = history.score.find((player) => {
    return player.placement === 2;
  }).id;
  const wScore: number = history.score.find((player) => {
    return player.placement === 1;
  }).score;
  const lScore: number = history.score.find((player) => {
    return player.placement === 2;
  }).score;

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
