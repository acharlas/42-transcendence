import { FunctionComponent, useContext, useEffect, useRef } from "react";
import Phaser from "phaser";

import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { useNavigate } from "react-router-dom";
import "./game.css";
import { CanvasHeight, CanvasWidth, HyperboostPaddleVelocity, PaddleVelocity } from "./consts/const";
import { GameMode } from "./game-type";

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  let navigate = useNavigate();
  const { socket } = useContext(SocketContext).SocketState;
  const {
    setBall,
    setPlayer1,
    setPlayer2,
    setCursors,
    setGame,
    game,
    setGameBounds,
    lobby,
    player1Score,
    player2Score,
  } = useGame();
  const gameRef = useRef<HTMLDivElement>(null);
  const playerOneId = useRef<string>(lobby?.playerOne?.id);
  const playerTwoId = useRef<string>(lobby?.playerTwo?.id);
  const paddleGamevelocity = lobby?.mode === GameMode.hyperspeed ? HyperboostPaddleVelocity : PaddleVelocity;

  useEffect(() => {
    //console.log(lobby);
    if (!lobby) navigate("/app");
  }, [lobby, navigate]);

  useEffect(() => {
    //console.log("USEEFFECT game-component new Phaser.Game");
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        width: CanvasWidth,
        height: CanvasHeight,
        mode: Phaser.Scale.FIT,
        parent: gameRef.current,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        init: init,
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
    });

    // Game variables
    let ball: Phaser.Physics.Arcade.Sprite;
    let player1: Phaser.Physics.Arcade.Sprite;
    let player2: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    let textScorePlayer1;
    let textScorePlayer2;

    function init() {
      if (socket === undefined) game.destroy(true);
    }

    function preload() {
      this.load.image("ball", "../image/ball.png");
      if (lobby && lobby.mode === GameMode.hyperspeed) {
        this.load.image("paddle", "../image/paddlex64.png");
      } else {
        this.load.image("paddle", "../image/paddle.png");
      }
      this.load.image("map", "../image/map_classic.png");
    }

    function create() {
      this.add.image(CanvasWidth / 2, CanvasHeight / 2, "map").setOrigin(0.5, 0.5);
      setGameBounds({
        x: this.physics.world.bounds.width,
        y: this.physics.world.bounds.height,
      });

      //ball
      ball = this.physics.add.sprite(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "ball");

      //players
      player1 = this.physics.add
        .sprite(this.physics.world.bounds.width - (ball.width / 2 + 1), this.physics.world.bounds.height / 2, "paddle")
        .setCollideWorldBounds(true)
        .setImmovable(true);

      player2 = this.physics.add
        .sprite(ball.width / 2 + 1, this.physics.world.bounds.height / 2, "paddle")
        .setCollideWorldBounds(true)
        .setImmovable(true);

      //input
      cursors = this.input.keyboard.createCursorKeys();

      //score
      //use stupid values to avoid firefox DOM warnings...
      const scoreStyle = {
        backgroundColor: "#00000000",
        color: "white",
        fontFamily: "Teko",
        fontSize: "130px",
        stroke: "#00000000",
        "shadow.color": "#00000000",
        "shadow.blur": 0,
        "shadow.stroke": false,
        "shadow.fill": true,
      };
      textScorePlayer1 = this.add.text((CanvasWidth * 1) / 4, CanvasHeight / 5, "0", scoreStyle).setOrigin(0.5, 0.5);
      textScorePlayer2 = this.add.text((CanvasWidth * 3) / 4, CanvasHeight / 5, "0", scoreStyle).setOrigin(0.5, 0.5);

      //react vars
      setCursors(cursors);
      setPlayer1(player1);
      setPlayer2(player2);
      setBall(ball);
      setGame(game);

      //dbg
      //console.log("paddle width: ", player1.body.width);
      //console.log("paddle height: ", player2.body.height);

      let position =
        playerOneId.current === window.sessionStorage.getItem("userid")
          ? (player2.body.position.x + player2.body.width / 2) / this.physics.world.bounds.width
          : (player1.body.position.x + player1.body.width / 2) / this.physics.world.bounds.width;
      socket.emit("UpdatePlayer", {
        paddleHeight: player1.body.height / this.physics.world.bounds.height,
        paddleWitdh: player1.body.width / this.physics.world.bounds.width,
        ballRadius: ball.body.height / this.physics.world.bounds.height,
        position,
      });

      if (lobby && lobby.mode === GameMode.hyperspeed) {
      }
    }

    function update() {
      textScorePlayer1.setText(player1Score.current);
      textScorePlayer2.setText(player2Score.current);

      player2.setVelocityY(0);
      player1.setVelocityY(0);

      if (cursors.up.isDown || cursors.down.isDown) {
        if (cursors.up.isDown) {
          if (lobby.playerTwo.id === window.sessionStorage.getItem("userid")) player1.setVelocityY(-paddleGamevelocity);
          if (lobby.playerOne.id === window.sessionStorage.getItem("userid")) player2.setVelocityY(-paddleGamevelocity);
        } else if (cursors.down.isDown) {
          if (lobby.playerTwo.id === window.sessionStorage.getItem("userid")) player1.setVelocityY(paddleGamevelocity);
          if (lobby.playerOne.id === window.sessionStorage.getItem("userid")) player2.setVelocityY(paddleGamevelocity);
        }

        if (playerTwoId.current === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: (player1.body.position.y + player1.body.height / 2) / this.physics.world.bounds.height,
          });
        if (playerOneId.current === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: (player2.body.position.y + player2.body.height / 2) / this.physics.world.bounds.height,
          });
      }
    }

    return function cleanup() {
      game.destroy(true);
    };
    // eslint-disable-next-line
  }, [
    navigate,
    socket,
    player1Score,
    player2Score,
    setBall,
    setCursors,
    setGame,
    setGameBounds,
    setPlayer1,
    setPlayer2,
  ]);

  useEffect(() => {
    //console.log("USEEFFECT game-component game init");
    if (game) {
      socket.emit("PlayerReady");
      if (
        lobby &&
        ((lobby.playerOne && lobby.playerOne.id === sessionStorage.getItem("userid")) ||
          (lobby.playerTwo && lobby.playerTwo.id === sessionStorage.getItem("userid")))
      )
        game.scene.pause("default");
    }
    // eslint-disable-next-line
  }, [game, socket]);

  return (
    <div className="game-root">
      <div className="game-root-child">
        <div className="game-canvas-parent" ref={gameRef} />
      </div>
    </div>
  );
};

export default GameComponent;
