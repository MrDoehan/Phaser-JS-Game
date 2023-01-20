const gameState = {};
class menu extends Phaser.Scene {
  constructor() {
    super({key: 'menu' });
  }
  create() {
    this.add.text(200, 200, 'Click to start!', {fill: '#add8e6', fontSize: '80px'})
    this.add.text(200, 300, 'Press C to view controls', {fill: "#add8e6", fontSize: '50px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('menu');
			this.scene.start('GameScene');
  })
}
}
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('cave', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_background.png');
    this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/platform.png');
    this.load.image('leap', 'jump pad.png');
    this.load.image('bomb', 'bomb.png');
    this.load.image('arrow', 'arrow.png');
    this.load.image('spike', "spike.png");
    this.load.image('speed', 'sped.png');
    this.load.image('trigger', 'detect block.png');
    this.load.spritesheet('alt', "ninja.png", {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('codey', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/codey_sprite.png', { frameWidth: 72, frameHeight: 90 });
    this.load.spritesheet('snowman', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/snowman.png', { frameWidth: 50, frameHeight: 70 });
    // Loads exit sprite sheet 
    this.load.spritesheet('exit', 'https://content.codecademy.com/courses/learn-phaser/Cave%20Crisis/cave_exit.png', { frameWidth: 60, frameHeight: 70 });
  }

  create() {
    gameState.active = true;

    this.add.image(0, 0, 'cave').setOrigin(0, 0);

    const platforms = this.physics.add.staticGroup();
    const arrow = this.physics.add.staticGroup();
    const spike = this.physics.add.staticGroup();
    const trig = this.physics.add.staticGroup();
    const platPositions = [
      { x: 50, y: 575 }, { x: 250, y: 575 }, { x: 450, y: 575 }, { x: 400, y: 380 }, { x: 100, y: 200 }
    ];
    const spikeLoc = [
      {x: 100, y: 500}, {x: 130, y: 500}
    ];
    const sensor = [
      {x: 200, y: 560}, {x: 1000, y: 560}
    ];
    spikeLoc.forEach(spi => {
      spike.create(spi.x, spi.y, 'spike')
    })
    sensor.forEach(sen => {
      trig.create(sen.x, sen.y, 'trigger');
    })
    for (let i = 50; i < 3000; i = i + 200) {
      platforms.create(i, 575, 'platform')
    }
    platPositions.forEach(plat => {
      platforms.create(plat.x, plat.y, 'platform')
    });
    const leap_pad = this.physics.add.staticGroup();
    const fast = this.physics.add.staticGroup();
    fast.create(800, 550, 'speed');
    leap_pad.create(200, 530, 'leap');
    arrow.create(1000, 530, 'arrow').setScale(.8);

    gameState.player = this.physics.add.sprite(50, 500, 'codey').setScale(.8);
    gameState.second = this.physics.add.sprite(60, 600, 'alt');
    //this should be where lots of the collision parts go
     
    this.physics.add.overlap(gameState.player, trig, () => {
      console.log("the sensor for projectiles to spawn has been activated");
    })
    this.physics.add.overlap(gameState.player, spike, () => {
      this.physics.pause();
      this.anims.pauseAll();
      gameState.active = false;
    })
    this.physics.add.overlap(gameState.player, leap_pad, () => {
      gameState.player.setVelocityY(-1000);
      
      console.log("contact");
      
    })
    this.physics.add.collider(gameState.player, platforms, () => {
      if (gameState.cursors.shift.isDown) {
        gameState.player.setVelocityY(0);
        if (gameState.cursors.up.isDown) {
          gameState.player.setVelocityY(-700);
        }
      }
    });
    gameState.player.setCollideWorldBounds(true);
    this.cameras.main.setBounds(0, 0, gameState.width, 500);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
    this.cameras.main.startFollow(gameState.player);
    //enemy movement here
    let p = 0;
    while (p != 10000000) {
      arrow.x -= 10;
      p = p + 10;
    }
      
    gameState.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    gameState.enemy = this.physics.add.sprite(480, 300, 'snowman');

    platforms
    this.physics.add.collider(gameState.enemy, platforms);
    
    this.anims.create({
      key: 'snowmanAlert',
      frames: this.anims.generateFrameNumbers('snowman', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    
    gameState.enemy.anims.play('snowmanAlert', true);

    this.physics.add.overlap(gameState.player, gameState.enemy, () => {
      // Executes code to end to game when Codey and the snowman overlap
      this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      // Restarts the scene if a mouse click is detected
      this.input.on('pointerup', () => {
        this.scene.restart();
      })
    });
    this.physics.add.overlap(gameState.player, gameState.enemy, () => {
      // Executes code to end to game when Codey and the snowman overlap
      this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      // Restarts the scene if a mouse click is detected
      this.input.on('pointerup', () => {
        this.scene.restart();
      })
    });

    gameState.exit = this.physics.add.sprite(50, 142, 'exit');
    this.anims.create({
      key: 'glow',
      frames: this.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1
    });
    this.physics.add.collider(gameState.exit, platforms);
    gameState.exit.anims.play('glow', true);

    // Adds a win condition
    this.physics.add.overlap(gameState.player, gameState.exit, () => {
      this.add.text(150, 50, 'You reached the exit!\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      // Add your code below for step 2:
      
      
      
      this.input.on('pointerup', () => {
        this.scene.restart();
      })
    })
    
    // Add your code below for step 1:
    
    
  }

  update() {
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = false;
      } else if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = true;
      } 
      else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }
      // Codey jumps if they are touching the ground and either the space bar or up arrow key is pressed
      if ((gameState.cursors.space.isDown || gameState.cursors.up.isDown)&& gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-700);
      } 
      //use for when colliding with a platform if (gameState.cursors.shift.isDown) {
          //gameState.player.setVelocityY(0);
      //}
    }
  }
}


const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2000 },
      enableBody: true,
    }
  },
  scene: [menu, GameScene]
};

const game = new Phaser.Game(config);


