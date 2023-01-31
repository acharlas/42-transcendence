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
import { CanvasHeight, CanvasWidth, PaddleSpeed } from "./consts/const";

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  console.clear()

  const { socket } = useContext(SocketContext).SocketState;
  const gameRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  if (!socket) navigate("/app/game");

   // Game variables
   let player: Phaser.Physics.Arcade.Sprite;
   let opponent: Phaser.Physics.Arcade.Sprite;
   let ball: Phaser.Physics.Arcade.Sprite;
   let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
   let gameStarted: boolean;

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameRef.current,
      scale: {
        width: CanvasWidth,
        height:CanvasHeight,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 }
        },
      }
    });


  function preload() {
    this.load.image("ball", "http://localhost:3001/assets/ball.png");
    this.load.image("paddle", "http://localhost:3001/assets/paddle.png");
  }

  function create() {


    // CREATE OBJECT //
    ball = this.physics.add.sprite(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "ball"
    ).setBounce(1, 1)
      .setCollideWorldBounds(true);

    player = this.physics.add.sprite(
      ball.width / 2 + 1,
      this.physics.world.bounds.height / 2,
      "paddle"
    ).setCollideWorldBounds(true);

    opponent = this.physics.add.sprite(
      this.physics.world.bounds.width - (ball.width / 2 + 1),
      this.physics.world.bounds.height / 2,
      "paddle"
    ).setCollideWorldBounds(true);

    /************************************/

    cursors = this.input.keyboard.createCursorKeys();

  
    this.physics.add.collider(ball, player, hitPaddle, null, this);
    this.physics.add.collider(ball, opponent, hitPaddle, null, this);

    player.setImmovable(true);
    opponent.setImmovable(true);

    socket.on('UpdatePaddle', (data) => {
      opponent.y = data.y
    });
    socket.on('UpdateBallVelocity', (data) => {
      ball.setVelocity(data.x, data.y)
    })
    socket.on('LaunchGame', (data) => {
      ball.setVelocity(data.x, data.y)
    })
  }

  function update() {

    console.log(ball.body.position )

    socket.emit('UpdatePaddle', {y: player.y})

    player.setVelocityY(0);
    opponent.setVelocityY(0);

    //move player

    if(cursors.up.isDown)
    {
      player.setVelocityY(-PaddleSpeed)  
    }
    else if (cursors.down.isDown)
    {
      player.setVelocityY(PaddleSpeed)
    }
    else if (cursors.left.isDown)
    {
      //temporary to start the game
      socket.emit("LaunchGame")
      
    }
  } 

  function hitPaddle(ball, paddle)
  {
    const accelfactor = (paddle.body.speed / PaddleSpeed / 11) + 1.1
    const newBallVelocity = Math.min(Math.max(ball.body.velocity.x * accelfactor,-700), 700)
    ball.setVelocityX(newBallVelocity)
    socket.emit('UpdateBallVelocity', {
      x: ball.body.velocity.x, 
      y: ball.body.velocity.y
    })
  }

    return () => {
      console.log("game destroy")
      game.destroy(true)
    }
  }, [socket]); 

  console.groupEnd()

  return (
      <div className="game-div" ref={gameRef} />
  );
};


export default GameComponent;
