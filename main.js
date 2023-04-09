class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    //this.load.image("background", "https://i.imgur.com/e8iO1kM.png");
    // this.load.image("player", "https://i.imgur.com/JUIMbc6.png");
    this.load.image("background", "images/nyc_8Bit.jpg");
    this.load.image("player", "images/game_bus_image_8bit.png");
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

    // Create the player character
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setCollideWorldBounds(true);

    // Set up input for jumping
    this.input.on("pointerdown", this.jump, this);
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
  }

  jump() {
    if (this.player.body.touching.down) {
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
