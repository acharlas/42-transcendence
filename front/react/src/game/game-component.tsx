import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { useGame } from "../context/game.context";
import SocketContext from "../context/socket.context";
import Phaser from "phaser";
import { PressStart2P } from './consts/Fonts'

export interface IGameComponentProps {}

const GameComponent: FunctionComponent<IGameComponentProps> = (props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { inQueue, lobby } = useGame();
  const [score, setScore] = useState([0,0])
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
        update: update
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0 },
        }
        
      }
    });

     // Game variables
    let ball: Phaser.Physics.Arcade.Body 

    function preload() {
      // Preload assets here
      this.load.image('ball', 'ball.png');
      this.load.image('paddle', 'paddle.png');
    }

    function create() {
      // Create game objects here

      ball = this.physics.add.sprite(
        this.physics.world.bounds.width / 2, // x position
        this.physics.world.bounds.height / 2, // y position
        'ball' // key of image for the sprite
    );
    this.physics.world.enable(ball);
    ball.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);

      


    }

    function update() {
      // Update game objects here
      

    }


  }, []);

  return <div ref={gameRef}/>;
};

export default GameComponent;
