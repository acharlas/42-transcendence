import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  // useState,
} from "react";
import Phaser from "phaser";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { useNavigate } from "react-router-dom";
import "./game-div.css"
import { CanvasHeight, CanvasWidth } from "./consts/const";

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const {
    setBall,
    setPlayer1,
    setPlayer2,
    setKeys,
    setCursors,
    setGame,
    game,
    setGameBounds,
    lobby,
    timer,
  } = useGame();
  // const [score, setScore] = useState([0, 0]);
  const gameRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  if (!socket) navigate("/app/game");

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
          gravity: { y: 0 }
        },
      },
    });

    // Game variables
    let player: Phaser.Physics.Arcade.Sprite;
    let opponent: Phaser.Physics.Arcade.Sprite;
    let ball: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    let gameStarted: boolean;

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

      // CREATE OBJECT //
      ball = this.physics.add.sprite(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        "ball"
      ).setBounce(1, 1)
        .setCollideWorldBounds(true);

      player = this.physics.add.sprite(
        this.physics.world.bounds.width - (ball.width / 2 + 1),
        this.physics.world.bounds.height / 2,
        "paddle"
      ).setCollideWorldBounds(true);

      opponent = this.physics.add.sprite(
        ball.width / 2 + 1,
        this.physics.world.bounds.height / 2,
        "paddle"
      ).setCollideWorldBounds(true);

      /************************************/

      cursors = this.input.keyboard.createCursorKeys();
      setCursors(cursors);
    
      this.physics.add.collider(ball, player, null, null, this);
      this.physics.add.collider(ball, opponent, null, null, this);

      player.setImmovable(true);
      opponent.setImmovable(true);

      setPlayer1(player)
      setPlayer2(opponent)
      setBall(ball);
      setGame(game);
    }

    function update() {
      // if (isPlayer1Point()) {
      //   ball.disableBody(true, true);
      //   return;
      // }
      // if (isPlayer2Point()) {
      //   ball.disableBody(true, true);
      //   return;
      // }

      player.setVelocityY(0);
      opponent.setVelocityY(0);

      if (!lobby) {
        navigate("/app/game");
        return;
      }

      //move player

        if (cursors.up.isDown) {
          if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
            opponent.setVelocityY(-350);
          if (lobby.playerOne === window.sessionStorage.getItem("userid"))
            player.setVelocityY(-350);
        } else if (cursors.down.isDown) {
          if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
            opponent.setVelocityY(350);
          if (lobby.playerOne === window.sessionStorage.getItem("userid"))
            player.setVelocityY(350);
        }

        if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: opponent.body.position.y / this.physics.world.bounds.height,
          });
        if (lobby.playerOne === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: player.body.position.y / this.physics.world.bounds.height,
          });

      //if host
      if (lobby.playerOne === window.sessionStorage.getItem("userid")) {
        if (!gameStarted) {
          ball.setVisible(true);
          gameStarted = true;
          const initialXSpeed = Math.random() * 20 + 50;
          const initialYSpeed = Math.random() * 20 + 50;
          ball.setVelocityX(initialXSpeed);
          ball.setVelocityY(initialYSpeed);
        }
        socket.emit("UpdateBallPosition", {
          pos: {
            x: ball.body.position.x / this.physics.world.bounds.width,
            y: ball.body.position.y / this.physics.world.bounds.height,
          },
        });
      }
    }


  }, [socket]);

  return (
      <div className="game-div" ref={gameRef} />
  );
};

export default GameComponent;
