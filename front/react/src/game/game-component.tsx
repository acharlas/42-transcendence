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
  if (!socket) navigate("/app/game");
  const {
    gameBounds,
    player1,
    player2,
    setBall,
    setPlayer1,
    setPlayer2,
    setCursors,
    setGame,
    game,
    setGameBounds,
    lobby,
    ball,
    player1Score,
    player2Score,
  } = useGame();
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    function onEvent() {
      console.log("event lunch");
      if (game) game.scene.resume("default");
    }

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
      textScorePlayer1 = this.add.text(CanvasWidth * 1 / 4 ,CanvasHeight / 5, "0", {
        fontSize: "100px"
      }
      ).setOrigin(0.5,0.5)

      textScorePlayer2 = this.add.text(CanvasWidth * 3 / 4 ,CanvasHeight / 5, "0", {
        fontSize: "100px"
      }
      ).setOrigin(0.5,0.5)

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
    }

    function update() {
      if (!lobby) {
        navigate("/app/game");
        return;
      }

      //TODO : not do that every frame?
      textScorePlayer1.setText(player1Score.current);
      textScorePlayer2.setText(player2Score.current);
      
      player2.setVelocityY(0);
      player1.setVelocityY(0);

      if (cursors.up.isDown || cursors.down.isDown) {
        if (cursors.up.isDown) {
          if (lobby.playerTwo.id === window.sessionStorage.getItem("userid")) player1.setVelocityY(-350);
          if (lobby.playerOne.id === window.sessionStorage.getItem("userid")) player2.setVelocityY(-350);
        } else if (cursors.down.isDown) {
          if (lobby.playerTwo.id === window.sessionStorage.getItem("userid")) player1.setVelocityY(350);
          if (lobby.playerOne.id === window.sessionStorage.getItem("userid")) player2.setVelocityY(350);
        }

        if (lobby.playerTwo.id === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: (player1.body.position.y + player1.body.height / 2) / this.physics.world.bounds.height,
          });
        if (lobby.playerOne.id === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: (player2.body.position.y + player2.body.height / 2) / this.physics.world.bounds.height,
          });
      }
    }

    return function cleanup() {};
  }, [socket, player1Score, player2Score]);

  const click = () => {
    setGame(game);
    socket.emit("PlayerReady");
  };
  const clickpa = () => {
    game.scene.pause("default");
  };

  useEffect(() => {
    if (!lobby) {
      navigate("/app/game");
      return;
    }
    if (game) {
      let position =
        lobby.playerOne.id === window.sessionStorage.getItem("userid")
          ? (player2.body.position.x + player2.body.width / 2) / gameBounds.x
          : (player1.body.position.x + player1.body.width / 2) / gameBounds.x;
      socket.emit("PlayerReady", {
        paddleHeight: player1.body.height / gameBounds.y,
        paddleWitdh: player1.body.width / gameBounds.x,
        ballRadius: ball.body.height / gameBounds.y,
        position,
      });
      game.scene.pause("default");
    }
  }, [game]);

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
