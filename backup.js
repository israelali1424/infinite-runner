class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Load the images
    this.load.image("background", "images/nyc_8Bit2.jpg");
    this.load.image("player", "images/Bus.png");
    this.load.image("coin", "images/coin.png");
    this.load.image("car1", "images/car1.png");
    this.load.image("car2", "images/car2.png");
    this.load.image("car3", "images/car3.png");

    //   Load the audio
    this.load.audio("coin_sound", " audio/coinCollection.wav");
    this.load.audio("car_crash", "audio/crash.wav");
    this.load.audio("game_over_sound", "audio/game-over-deep-epic.wav");
    this.load.audio("background_music", "audio/game-music-loop-8.wav");
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
    // Create sound objects
    this.coinSound = this.sound.add("coin_sound");
    this.carCrashSound = this.sound.add("car_crash");

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

    // Create a group for cars
    this.cars = this.physics.add.group();
    this.nextCarAt = 0;

    // Set up collision handler for cars
    this.physics.add.collider(this.player, this.cars, this.endGame, null, this);
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.coinCounter++;
    this.coinCounterText.setText("Coins: " + this.coinCounter);
    this.coinSound.play(); // Play the coin sound effect
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
      this.nextCoinAt = this.time.now + 2000; // Adjust the time interval between coin spawns
      const coinY = 560;
      const coinX = Phaser.Math.Between(850, 1100); // Adjust the X range for the coins
      const existingCoin = this.coins.children.entries.find(
        (coin) => Math.abs(coin.x - coinX) < 50
      );
      if (!existingCoin) {
        const coin = this.coins.create(coinX, coinY, "coin");
        coin.setScale(0.2); // set the size of the car
        coin.body.allowGravity = false; // Prevent the coin from being affected by gravity
        coin.setVelocityX(-100); // Adjust the speed of the coins
      }
    }

    // Spawn cars randomly
    if (this.time.now > this.nextCarAt) {
      this.nextCarAt = this.time.now + 2000; // Adjust the time interval between car spawns
      const carY = 580;
      const carX = Phaser.Math.Between(850, 1100); // Adjust the X range for the coins
      const carModel = Phaser.Math.Between(1, 3); // Randomly select a car model (1, 2, or 3)
      const carImage = "car" + carModel;

      const existingCar = this.cars.children.entries.find(
        // the lication of all cars created
        (car) => Math.abs(car.x - carX) < 50
      );
      if (!existingCar) {
        const car = this.cars.create(carX, carY, carImage); //if there is not an existing car at said location than create a new car there
        car.setScale(0.2);
        car.body.allowGravity = false;
        car.setVelocityX(-150); // Adjust the speed of the cars
        car.setSize(car.width * 0.5, car.height * 0.5); // Set a custom hitbox for the car
      }
    }

    // Remove cars that have left the screen
    this.cars.children.iterate((car) => {
      if (car.x < -car.width) {
        car.disableBody(true, true);
      }
    });
  }

  jump() {
    if (this.player.body.blocked.down) {
      this.player.setVelocityY(-600);
      this.player.setVelocityX(40); // Move slightly forward when jumping
    } else {
      this.player.setVelocityX(0); // Reset horizontal velocity when not jumping
    }
  }

  // Function to end the game when the player hits a car
  endGame() {
    this.carCrashSound.play(); // Play the car crash sound effect
    this.scene.start("EndScene");
  }
}
class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  create() {
    this.add.text(300, 300, "Game Over", {
      fontSize: "32px",
      fill: "#000",
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
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
  scene: [PreloadScene, GameScene, EndScene],
};

const game = new Phaser.Game(config);
