class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Load the images
    this.load.image("background", "images/nyc_8Bit2.jpg");
    this.load.image("player", "images/Bus.png");
    this.load.image("coin", "images/coin.png");
  }

  create() {
    // Start the GameScene
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
    this.player = this.physics.add.sprite(100, 550, "player");
    this.player.setDepth(1); // Set the depth of the player so it's always in front of the coins
    this.player.setScale(0.35);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    // Set up input for jumping
    this.input.keyboard.on("keydown-SPACE", this.jump, this); // Spacebar input for desktop
    this.input.on("pointerdown", this.jump, this); // Screen tap input for mobile

    // Create a group for coins
    this.coins = this.physics.add.group();
    this.nextCoinAt = 0;

    // Coin counter
    this.coinCounter = 0;
    // This is a creates the coin counter orginal state and postion on the webpage
    this.coinCounterText = this.add.text(600, 50, "Coins: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    // Add collision between coins and ground
    //this.coins.setCollideWorldBounds(true);
    this.physics.add.collider(this.coins, this.ground);

    // Set up collision handler for coins
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );
  }

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
      const coinY = Phaser.Math.Between(550, 550); // Adjust the Y range for the coins
      const coinX = Phaser.Math.Between(1, 1100); // Adjust the X range for the coins
      const coin = this.coins.create(coinX, coinY, "coin");
      coin.setScale(0.4);
      coin.body.allowGravity = false; // Prevent the coin from being affected by gravit
      coin.setVelocityX(-100); // Adjust the speed of the coins
    }
    this.player.setVelocityX(12);
  }

  jump() {
    if (this.player.body.blocked.down) {
      this.player.setVelocityY(-600);
    }
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
