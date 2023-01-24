import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Phaser from "phaser";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import { GameMode } from "./game-type";
import { useNavigate } from "react-router-dom";

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
  const [score, setScore] = useState([0, 0]);
  const gameRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  if (!socket) navigate("/app/game");

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        width: 800,
        height: 600,
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
          debug: true
        },
      },
    });

    // Game variables
    let ball: Phaser.Physics.Arcade.Sprite;
    let player1: Phaser.Physics.Arcade.Sprite;
    let player2: Phaser.Physics.Arcade.Sprite;
    let keys: Phaser.Input.Keyboard.KeyboardPlugin;
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
      ball = this.physics.add.sprite(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        "ball"
      );
      setGameBounds({
        x: this.physics.world.bounds.width - (ball.width / 2 + 1),
        y: this.physics.world.bounds.height,
      });
      ball.setBounce(1, 1).setCollideWorldBounds(true);
      player1 = this.physics.add.sprite(
        this.physics.world.bounds.width - (ball.width / 2 + 1),
        this.physics.world.bounds.height / 2,
        "paddle"
      );
      player1.setCollideWorldBounds(true);
      setPlayer1(player1);
      player2 = this.physics.add.sprite(
        ball.width / 2 + 1,
        this.physics.world.bounds.height / 2,
        "paddle"
      );
      player2.setCollideWorldBounds(true);
      setPlayer2(player2);
      cursors = this.input.keyboard.createCursorKeys();
      setCursors(cursors);
      keys = this.input.keyboard.addKeys("W,S,Z", false);
      setKeys(keys);
      this.physics.add.collider(ball, player1, null, null, this);
      this.physics.add.collider(ball, player2, null, null, this);

      player1.setImmovable(true);
      player2.setImmovable(true);
      console.log(
        "salut: ",
        player1.body.height / this.physics.world.bounds.height,
        " ",
        player1.body.width / this.physics.world.bounds.width,
        " ",
        ball.body.height / this.physics.world.bounds.height
      );
      setBall(ball);
      setGame(game);
    }

    function update() {
      if (isPlayer1Point()) {
        ball.disableBody(true, true);
        return;
      }
      if (isPlayer2Point()) {
        ball.disableBody(true, true);
        return;
      }

      player2.setVelocityY(0);
      player1.setVelocityY(0);

      //PLAYER DROITE
      //If statement to get player position from server
      //

      // if(cursors.up.isDown)
      // {
      //   player1.body.position = new Phaser.Math.Vector2(player1.body.position.x, y) // y = nouvelle valeur
      // }

      if (!lobby) {
        navigate("/app/game");
        return;
      }

      //move player
      if (keys.W.isDown || keys.Z.isDown || keys.S.isDown) {
        if (keys.W.isDown || keys.Z.isDown) {
          if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
            player1.setVelocityY(-350);
          if (lobby.playerOne === window.sessionStorage.getItem("userid"))
            player2.setVelocityY(-350);
        } else if (keys.S.isDown) {
          if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
            player1.setVelocityY(350);
          if (lobby.playerOne === window.sessionStorage.getItem("userid"))
            player2.setVelocityY(350);
        }
        if (lobby.playerTwo === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: player1.body.position.y / this.physics.world.bounds.height,
          });
        if (lobby.playerOne === window.sessionStorage.getItem("userid"))
          socket.emit("UpdatePlayerPosition", {
            pos: player2.body.position.y / this.physics.world.bounds.height,
          });
      }

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

    // function movePlayerDown(player: Phaser.Physics.Arcade.Sprite) {
    //   player.setVelocityY(-350);
    //   socket.emit("UpdatePlayerPosition", { pos: player.body.position.y });
    // }
    // function movePlayerUp(player: Phaser.Physics.Arcade.Sprite) {
    //   player.setVelocityY(350);
    //   socket.emit("UpdatePlayerPosition", { pos: player.body.position.y });
    // }

    function isPlayer1Point() {
      return ball.body.x < player2.body.x;
    }

    function isPlayer2Point() {
      return ball.body.x > player1.body.x;
    }
    //else navigate("/app/game");
  }, [socket]);

  const click = () => {
    setGame(game);
    socket.emit("PlayerReady");
  };
  const clickpa = () => {
    game.scene.pause("default");
  };

  useEffect(() => {
    if (game) {
      console.log("PAUSE");
      socket.emit("PlayerReady");
      game.scene.pause("default");
    }
  }, [game]);

  return (
    <>
      <button onClick={clickpa}>Pause</button>
      <button onClick={click}>PlayerReady</button>
      <button>timer: {timer}</button>
      <div ref={gameRef} />
    </>
  );
};

export default GameComponent;
