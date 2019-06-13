class Player {
  constructor() {
    this.pos = createVector(playerPos.x * tileSize + tileSize / 4 + xoff, playerPos.y * tileSize + tileSize / 4 + yoff);
    this.vel = createVector(0, 0);
    this.size = tileSize / 2.0;
    this.playerSpeed = tileSize / 15.0;
    this.dead = false;
    this.reachedGoal = false;
    this.fadeCounter = 255;
    this.isBest = false;
    this.deathByDot = false;
    this.deathAtStep = 0;
    this.moveCount = 0;
    this.gen = 1;
    this.fitness = 0;
    this.nodes = [];
    this.fading = false;
    this.brain = new Brain(numberOfSteps);
    this.human = false;
    this.coins = [];
    this.setCoins(); // = new Coin(9.5*tileSize+xoff, 2.5*tileSize+yoff);
    this.setNodes();

  }
  setCoins() {}
  setNodes() {
    this.nodes[0] = new Node(createVector(955, 85), false, false);
    this.nodes[1] = new Node(createVector(955, 535), false, false);
    this.nodes[2] = new Node(createVector(305, 535), false, false);
    this.nodes[3] = new Node(createVector(305, 185), false, false);
    this.nodes[4] = new Node(createVector(855, 185), false, false);
    this.nodes[5] = new Node(createVector(855, 435), false, false);
    this.nodes[6] = new Node(createVector(405, 435), false, false);
    this.nodes[7] = new Node(createVector(405, 285), false, false);
    this.nodes[8] = new Node(createVector(755, 310), false, false);
    this.nodes[7].setDistanceToFinish(this.nodes[8]);
    this.nodes[6].setDistanceToFinish(this.nodes[7]);
    this.nodes[5].setDistanceToFinish(this.nodes[6]);
    this.nodes[4].setDistanceToFinish(this.nodes[5]);
    this.nodes[3].setDistanceToFinish(this.nodes[4]);
    this.nodes[2].setDistanceToFinish(this.nodes[3]);
    this.nodes[1].setDistanceToFinish(this.nodes[2]);
    this.nodes[0].setDistanceToFinish(this.nodes[1]);
  }
  show() {
    fill(255, 0, 0, this.fadeCounter);
    if(this.isBest && !showBest) {
      fill(0, 255, 0, this.fadeCounter);
    }
    stroke(0, 0, 0, this.fadeCounter);
    strokeWeight(4);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    stroke(0);
    for(var i = 0; i < this.coins.length; i++) {
      this.coins[i].show();
    }

  }

  move() {
    if(!humanPlaying) {
      if(this.moveCount == 0) { //move in the direction for 6 frames
        if(this.brain.directions.length > this.brain.step) { //if there are still directions left then set the velocity as the next PVector in the direcitons array
          this.vel = this.brain.directions[this.brain.step];
          this.brain.step++;
        } else { //if at the end of the directions array then the player is dead
          this.dead = true;
          this.fading = true;
        }
        this.moveCount = 10;
      } else {
        this.moveCount--;
      }
    }
    var temp = createVector(this.vel.x, this.vel.y);
    temp.normalize();
    temp.mult(this.playerSpeed);
    for(var i = 0; i < solids.length; i++) {
      temp = solids[i].restrictMovement(this.pos, createVector(this.pos.x + this.size, this.pos.y + this.size), temp);
    }
    this.pos.add(temp);
  }
  checkCollisions() {
      for(var i = 0; i < this.coins.length; i++) {
        this.coins[i].collides(this.pos, createVector(this.pos.x + this.size, this.pos.y + this.size));
      }

      for(var i = 0; i < dots.length; i++) {
        if(dots[i].collides(this.pos, createVector(this.pos.x + this.size, this.pos.y + this.size))) {
          this.fading = true;
          this.dead = true;
          this.deathByDot = true;
          this.deathAtStep = this.brain.step;
        }
      }
      this.reachedGoal = true;
      if(!winArea.collision(this.pos, createVector(this.pos.x + this.size, this.pos.y + this.size))) {
        this.reachedGoal = false;
      } else {
        for(var i = 0; i < this.coins.length; i++) {
          if(!this.coins[i].taken) {
            this.reachedGoal = false;
            break;
          }
        }
      }
      for(var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].collision(this.pos, createVector(this.pos.x + this.size, this.pos.y + this.size));
      }
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------
  update() {
      if(!this.dead && !this.reachedGoal) {
        this.move();
        this.checkCollisions();
      } else if(this.fading) {
        if(this.fadeCounter > 0) {
          if(humanPlaying || replayGens) {
            this.fadeCounter -= 10;
          } else {
            this.fadeCounter = 0;

          }
        }
      }
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

  calculateFitness() {
    if(this.reachedGoal) { //if the dot reached the goal then the fitness is based on the amount of steps it took to get there
      this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step);
    } else { //if the dot didn't reach the goal then the fitness is based on how close it is to the goal
      var estimatedDistance = 0.0; //the estimated distance of the path from the player to the goal
      for(var i = this.nodes.length - 1; i >= 0; i--) {
        if(!this.nodes[i].reached) {
          estimatedDistance = this.nodes[i].distToFinish;
          estimatedDistance += dist(this.pos.x, this.pos.y, this.nodes[i].pos.x, this.nodes[i].pos.y);
        }
      }
      this.fitness = 1.0 / (estimatedDistance * estimatedDistance);

      if(this.deathByDot) {
        this.fitness *= 0.6;
      }
    }
    this.fitness *= this.fitness;
    for(var i = 0; i < this.coins.length; i++) {
      if(this.coins[i].taken) {
        this.fitness *= 1.2;
      }
    }
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  gimmeBaby() {
    var baby = new Player();
    baby.brain = this.brain.clone(); //babies have the same brain as their parents
    baby.deathByDot = this.deathByDot;
    baby.deathAtStep = this.deathAtStep;
    baby.gen = this.gen;
    return baby;
  }
}
