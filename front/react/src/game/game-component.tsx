import { FunctionComponent, useContext, useEffect, useRef } from "react";
import Phaser from "phaser";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { useNavigate } from "react-router-dom";
import { CanvasHeight, CanvasWidth } from "./consts/const";

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

  useEffect(() => {
    if (!socket) navigate("/app/game");
    console.log("USEEFFECT game-component new Phaser.Game");
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        width: CanvasWidth,
        height: CanvasHeight,
        mode: Phaser.Scale.FIT,
        parent: gameRef.current,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
          debug: true,
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
      this.load.image("ball", "http://localhost:3001/assets/ball.png");
      this.load.image("paddle", "http://localhost:3001/assets/paddle.png");
    }

    function create() {
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
      textScorePlayer1 = this.add
        .text((CanvasWidth * 1) / 4, CanvasHeight / 5, "0", {
          fontSize: "100px",
        })
        .setOrigin(0.5, 0.5);

      textScorePlayer2 = this.add
        .text((CanvasWidth * 3) / 4, CanvasHeight / 5, "0", {
          fontSize: "100px",
        })
        .setOrigin(0.5, 0.5);

      //react vars
      setCursors(cursors);
      setPlayer1(player1);
      setPlayer2(player2);
      setBall(ball);
      setGame(game);

      //dbg
      console.log(
        "salut: ",
        player1.body.height / this.physics.world.bounds.height,
        " ",
        player1.body.width / this.physics.world.bounds.width,
        " ",
        ball.body.height / this.physics.world.bounds.height
      );
      console.log("paddle width: ", player1.body.width);
      console.log("paddle height: ", player2.body.height);

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
    }

    function update() {
      //TODO : not do that every frame?
      textScorePlayer1.setText(player1Score.current);
      textScorePlayer2.setText(player2Score.current);

      player2.setVelocityY(0);
      player1.setVelocityY(0);

      if (cursors.up.isDown || cursors.down.isDown) {
        if (cursors.up.isDown) {
          if (playerTwoId.current === window.sessionStorage.getItem("userid")) player1.setVelocityY(-350);
          if (playerOneId.current === window.sessionStorage.getItem("userid")) player2.setVelocityY(-350);
        } else if (cursors.down.isDown) {
          if (playerTwoId.current === window.sessionStorage.getItem("userid")) player1.setVelocityY(350);
          if (playerOneId.current === window.sessionStorage.getItem("userid")) player2.setVelocityY(350);
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

    return function cleanup() {};
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

  const click = () => {
    setGame(game);
    socket.emit("PlayerReady");
  };
  const clickpa = () => {
    game.scene.pause("default");
  };

  useEffect(() => {
    console.log("USEEFFECT game-component game init");

    if (game) {
      socket.emit("PlayerReady");
      game.scene.pause("default");
    }
  }, [game, socket]);

  return (
    <>
      <button onClick={clickpa}>Pause</button>
      <button onClick={click}>PlayerReady</button>
      <button>timer</button>
      <div ref={gameRef} />
    </>
  );
};

export default GameComponent;
