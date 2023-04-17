class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: "PreloadScene" });
    }
  
    preload() {
      //this.load.image("background", "https://i.imgur.com/e8iO1kM.png");
      // this.load.image("player", "https://i.imgur.com/JUIMbc6.png");
      //this.load.image("background", "images/background22.png");
      this.load.image("background", "images/nyc_8Bit2.jpg");
      this.load.image("player", "images/Bus.png");
      this.load.image("coin", "images/coin.png");
    }
  
    create() {
      this.scene.start("GameScene");
    }
  }
  
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: "GameScene" });
    }
  
    create() {
      // Create a repeating background
      this.bg1 = this.add
        .tileSprite(0, 0, 800, 600, "background")
        .setOrigin(0, 0);
      this.bg2 = this.add
        .tileSprite(800, 0, 800, 600, "background")
        .setOrigin(0, 0);
  
      // Create an invisible ground
      this.ground = this.physics.add.staticGroup();
      this.ground
        .create(400, 570, "background")
        .setScale(800, 1)
        .setVisible(false)
        .refreshBody();
  
      this.ground
        .create(400, 550, "background")
        .setScale(800, 1)
        .setVisible(false)
        .refreshBody();
  
      // Create the player character
      this.player = this.physics.add.sprite(100, 400, "player");
      // this.player = this.physics.add.sprite(
      //   this.sys.game.config.width / 2,
      //   0,
      //   "player"
      // );
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.ground);
      // Set up input for jumping
      this.input.keyboard.on("keydown-SPACE", this.jump, this); // Spacebar input for desktop
      this.input.on("pointerdown", this.jump, this); // Screen tap input for mobile
  
      // Add collision between player and ground
  
      // //define our objects
      // let ball = this.physics.add.sprite(
      //   this.sys.game.config.width / 2,
      //   0,
      //   "ball"
      // );
      // //make a class reference
      // this.ball = ball;
      // this.ball.setCollideWorldBounds(true);
      // ... Previous code remains the same ...
  
      // Create a coin group
      // Create a group for coins
      this.coins = this.physics.add.group();
      this.nextCoinAt = 0;
  
      // Coin counter
      this.coinCounter = 0;
      this.coinCounterText = this.add.text(700, 50, "Coins: 0", {
        fontSize: "32px",
        fill: "#000",
      });
  
      // Set up collision handler for coins
      this.physics.add.overlap(
        this.player,
        this.coins,
        this.collectCoin,
        null,
        this
      );
  
      // ...
      
    }
  
    // ... Rest of the code remains the same ...
    collectCoin(player, coin) {
      coin.disableBody(true, true);
      this.coinCounter++;
      this.coinCounterText.setText("Coins: " + this.coinCounter);
    }
  
    update() {
      // Scroll the background infinitely
      this.bg1.x -= 2;
      this.bg2.x -= 2;
  
      if (this.bg1.x <= -800) {
        this.bg1.x = 800;
      }
  
      if (this.bg2.x <= -800) {
        this.bg2.x = 800;
      }
      // Spawn coins and move them towards the car
      if (this.time.now > this.nextCoinAt) {
        this.nextCoinAt = this.time.now + 1000; // Adjust the time interval between coin spawns
        const coinY = Phaser.Math.Between(200, 400); // Adjust the Y range for the coins
        const coin = this.coins.create(850, coinY, "coin");
        coin.setVelocityX(-100); // Adjust the speed of the coins
      }
    }
  
    jump() {
      console.log("Jump PrESSED");
      if (this.player.body.blocked.down) {
        console.log("Jump Happned");
        this.player.setVelocityY(-600);
        // this.ball.setVelocityY(-600);
      }
      //this.player.setVelocityY(-500);
      // this.ball.setVelocityY(-200);
    }
  }
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1200 },
        debug: false,
      },
    },
    scene: [PreloadScene, GameScene],
  };
  
  const game = new Phaser.Game(config);
  