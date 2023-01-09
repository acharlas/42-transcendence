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
          debug: true
        }
        
      }
    });

     // Game variables
    let ball
    let player1
    let player2
    let gameStarted = false

    let keys
    let cursors;

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
    ball.setBounce(1, 1).setCollideWorldBounds(true);

    player1 = this.physics.add.sprite(
      this.physics.world.bounds.width - (ball.width / 2 + 1), // x position
      this.physics.world.bounds.height / 2, // y position
      'paddle', // key of image for the sprite
    );
    player1.setCollideWorldBounds(true);

    player2 = this.physics.add.sprite(
      (ball.width / 2 + 1), // x position
      this.physics.world.bounds.height / 2, // y position
      'paddle', // key of image for the sprite
    );
    player2.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,S,Z');
   
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

    player1.body.setVelocityY(0);
    player2.body.setVelocityY(0);

    if (cursors.up.isDown) {
        player1.body.setVelocityY(-350);
    } else if (cursors.down.isDown) {
        player1.body.setVelocityY(350);
    }
    // TODO: Allow player to move forward
    
    if (keys.W.isDown || keys.Z.isDown) {
        player2.body.setVelocityY(-350);
    } else if (keys.S.isDown) {
        player2.body.setVelocityY(350);
    }
    // TODO: Allow player to move forward

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

    function isPlayer1Point() {
        return ball.body.x < player2.body.x;
    }

    function isPlayer2Point() {
        return ball.body.x > player1.body.x;
    }

  }, []);

  return <div ref={gameRef}/>;
};

export default GameComponent;
