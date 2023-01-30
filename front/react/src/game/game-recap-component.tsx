import { GoThumbsdown } from "react-icons/go";
import { FaSadCry, FaTrophy } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

import "./game-recap.css";
import Avatar from "../avatar/avatar_component";

export default function GameRecap() {
  const wName: string = "wowsuchwinner";
  const lName: string = "bAdPlaYer";
  const wId: string = "c2f4b2d3-02e4-496d-aa3e-f68aa85a2300";
  const lId: string = "9f0aba3a-ebe4-40ff-9417-1e2a5b92319e";
  const wScore: number = 10;
  const lScore: number = 0;
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
