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
import { io, Socket } from "socket.io-client";
// import { GameMode } from "./game-type";
// import { PressStart2P } from "./consts/Fonts";
// import ballImage from "../public/logo192.png";
// import paddleImage from "./assets/paddle.png"

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby, playerTwoPosition, setPlayerTwoPosition } = useGame();
  const [score, setScore] = useState([0, 0]);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a new Phaser 3 game
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 500,
      // scale: {
      //   mode: Phaser.Scale.RESIZE,
      //   autoCenter: Phaser.Scale.CENTER_BOTH
      // },
      scene: {
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
  }, []);

  // Game variables
  let ball;
  let player1;
  let player2;
  let gameStarted = false;
  let socketGame: Socket;

  let keys;
  let cursors;

  function preload() {
    // Preload assets here
    this.load.image("ball", "http://localhost:3001/assets/ball.png");
    this.load.image("paddle", "http://localhost:3001/assets/paddle.png");
  }

  function create() {
    var self = this;
    //create socket
    this.socket = io("http://localhost:3333/game", {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      autoConnect: false,
      auth: {
        token: sessionStorage.getItem("RefreshToken"),
      },
    });
    // Create game objects here
    ball = this.physics.add.sprite(
      this.physics.world.bounds.width / 2, // x position
      this.physics.world.bounds.height / 2, // y position
      "ball" // key of image for the sprite
    );
    ball.setBounce(1, 1).setCollideWorldBounds(true);

    player1 = this.physics.add.sprite(
      this.physics.world.bounds.width - (ball.width / 2 + 1), // x position
      this.physics.world.bounds.height / 2, // y position
      "paddle" // key of image for the sprite
    );
    player1.setCollideWorldBounds(true);

    player2 = this.physics.add.sprite(
      ball.width / 2 + 1, // x position
      this.physics.world.bounds.height / 2, // y position
      "paddle" // key of image for the sprite
    );
    player2.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys("W,S,Z");

    this.physics.add.collider(ball, player1, null, null, this);
    this.physics.add.collider(ball, player2, null, null, this);

    player1.setImmovable(true);
    player2.setImmovable(true);
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

    player2.body.setVelocityY(0);

    //PLAYER DROITE
    //If statement to get player position from server
    //
    player1.body.position = new Phaser.Math.Vector2(
      player1.body.position.x,
      playerTwoPosition
    ); // y = nouvelle valeur

    //PLAYER GAUCHE
    if (keys.W.isDown || keys.Z.isDown || keys.S.isDown) {
      if (keys.W.isDown || keys.Z.isDown) {
        player2.body.setVelocityY(-350);
      } else if (keys.S.isDown) {
        player2.body.setVelocityY(350);
      }
      console.log("socket: ", socketGame);
      this.socket.emit("UpdatePlayerPosition", {
        pos: player1.body.position.y,
      });
    }

    if (!gameStarted) {
      if (cursors.space.isDown) {
        ball.setVisible(true);
        gameStarted = true;
        const initialXSpeed = Math.random() * 20 + 50;
        const initialYSpeed = Math.random() * 20 + 50;
        ball.setVelocityX(initialXSpeed);
        ball.setVelocityY(initialYSpeed);
        // openingText.setVisible(false);
      }
    }
  }

  function playerMovement() {}

  function isPlayer1Point() {
    return ball.body.x < player2.body.x;
  }

  function isPlayer2Point() {
    return ball.body.x > player1.body.x;
  }

  // //handle lobby
  // const handleClick = () => {
  //   socket.emit("JoiningQueue");
  // };

  // const handleCreateLobbyClick = () => {
  //   socket.emit("CreateLobby");
  // };

  // const handleLeavingLobbyClick = () => {
  //   socket.emit("LeavingLobby");
  // };

  // const handleSendHistoryClick = () => {
  //   const playerOne = {
  //     id: "2ce6e635-f65c-4150-ae8c-4293a4227bdb",
  //     score: 3,
  //     placement: 1,
  //   };
  //   const playerTwo = {
  //     id: "afc89610-96e7-4ef5-bd9c-2dd279936c2c",
  //     score: 0,
  //     placement: 2,
  //   };
  //   const newHistory = {
  //     mode: GameMode.classic,
  //     score: [playerOne, playerTwo],
  //   };
  //   socket.emit("NewHistory", { newHistory: newHistory });
  // };
  /**<div>
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
              </>
            )}
          </>
        )}
      </div> */
  return (
    <>
      <div ref={gameRef} />
    </>
  );
};

export default GameComponent;
