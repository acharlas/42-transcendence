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
// import paddleImage from "./assets/paddle.png"

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const {
    inQueue,
    lobby,
    setBall,
    setPlayer1,
    setPlayer2,
    setKeys,
    setCursors,
    setGameStarted,
    ball,
    player1,
    player2,
    keys,
    cursors,
    gameStarted,
  } = useGame();
  const [score, setScore] = useState([0, 0]);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a new Phaser 3 game
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
          //   debug: true
        },
      },
    });

    // Game variables
    let ball: Phaser.Physics.Arcade.Sprite;
    let player1: Phaser.Physics.Arcade.Sprite;
    let player2: Phaser.Physics.Arcade.Sprite;
    let keys: Phaser.Input.Keyboard.KeyboardPlugin;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    function init() {
      if (socket == undefined) game.destroy(true);
    }

    function preload() {
      // Preload assets here
      this.load.image("ball", "http://localhost:3001/assets/ball.png");
      this.load.image("paddle", "http://localhost:3001/assets/paddle.png");
    }

    function create() {
      // Create game objects here
      ball = this.physics.add.sprite(
        this.physics.world.bounds.width / 2, // x position
        this.physics.world.bounds.height / 2, // y position
        "ball" // key of image for the sprite
      );
      ball.setBounce(1, 1).setCollideWorldBounds(true);
      setBall(ball);
      player1 = this.physics.add.sprite(
        this.physics.world.bounds.width - (ball.width / 2 + 1), // x position
        this.physics.world.bounds.height / 2, // y position
        "paddle" // key of image for the sprite
      );
      console.log(this.physics.world.bounds.width - (ball.width / 2 + 1));
      player1.setCollideWorldBounds(true);
      setPlayer1(player1);
      player2 = this.physics.add.sprite(
        ball.width / 2 + 1, // x position
        this.physics.world.bounds.height / 2, // y position
        "paddle" // key of image for the sprite
      );
      player2.setCollideWorldBounds(true);
      setPlayer2(player1);
      console.log(
        "afd",
        this.physics.world.bounds.width - (ball.width / 2 + 1)
      );
      cursors = this.input.keyboard.createCursorKeys();
      setCursors(cursors);
      keys = this.input.keyboard.addKeys("W,S,Z");
      setKeys(keys);
      this.physics.add.collider(ball, player1, null, null, this);
      this.physics.add.collider(ball, player2, null, null, this);

      player1.setImmovable(true);
      player2.setImmovable(true);

      // gestion socket

      //	socket.on(playermovement, )
    }

    function update() {
      // Update game objects here
      if (isPlayer1Point()) {
        // player1VictoryText.setVisible(true);
        ball.disableBody(true, true);
        return;
      }
      if (isPlayer2Point()) {
        // player2VictoryText.setVisible(true);
        ball.disableBody(true, true);
        return;
      }

      player2.setVelocityY(0);

      //PLAYER DROITE
      //If statement to get player position from server
      //

      // if(cursors.up.isDown)
      // {
      //   player1.body.position = new Phaser.Math.Vector2(player1.body.position.x, y) // y = nouvelle valeur
      // }

      //PLAYER GAUCHE
      if (keys.W.isDown || keys.Z.isDown) {
        movePlayerDown(player2);
      } else if (keys.S.isDown) {
        movePlayerUp(player2);
      }

      if (!gameStarted) {
        if (cursors.space.isDown) {
          ball.setVisible(true);
          setGameStarted(true);
          const initialXSpeed = Math.random() * 20 + 50;
          const initialYSpeed = Math.random() * 20 + 50;
          ball.setVelocityX(initialXSpeed);
          ball.setVelocityY(initialYSpeed);
          // openingText.setVisible(false);
        }
      }
    }

    function movePlayerDown(player: Phaser.Physics.Arcade.Sprite) {
      player.setVelocityY(-350);
      socket.emit("UpdatePlayerPosition", { pos: player.body.position.y });
    }
    function movePlayerUp(player: Phaser.Physics.Arcade.Sprite) {
      player.setVelocityY(350);
      socket.emit("UpdatePlayerPosition", { pos: player.body.position.y });
    }

    function isPlayer1Point() {
      return ball.body.x < player2.body.x;
    }

    function isPlayer2Point() {
      return ball.body.x > player1.body.x;
    }
  }, [socket]);

  const handleClick = () => {
    socket.emit("JoiningQueue");
  };

  const handleCreateLobbyClick = () => {
    socket.emit("CreateLobby");
  };

  const handleLeavingLobbyClick = () => {
    socket.emit("LeavingLobby");
  };

  const handleSendHistoryClick = () => {
    const playerOne = {
      id: "2ce6e635-f65c-4150-ae8c-4293a4227bdb",
      score: 3,
      placement: 1,
    };
    const playerTwo = {
      id: "afc89610-96e7-4ef5-bd9c-2dd279936c2c",
      score: 0,
      placement: 2,
    };
    const newHistory = {
      mode: GameMode.classic,
      score: [playerOne, playerTwo],
    };
    socket.emit("NewHistory", { newHistory: newHistory });
  };

  return (
    <>
      <div>
        {socket ? <>salut: {socket.id}</> : <></>}
        {lobby ? (
          <>
            <button>{lobby.playerOne}</button>{" "}
            <button>{lobby.playerTwo}</button>
            <button onClick={handleLeavingLobbyClick}>Leave lobby</button>
          </>
        ) : (
          <>
            {inQueue ? (
              <button>waiting for player</button>
            ) : (
              <>
                <button onClick={handleClick}>join matchmaking</button>
                <button onClick={handleCreateLobbyClick}>create lobby</button>
                <button onClick={handleSendHistoryClick}>send history</button>
              </>
            )}
          </>
        )}
      </div>
      <div ref={gameRef} />
    </>
  );
};

export default GameComponent;
