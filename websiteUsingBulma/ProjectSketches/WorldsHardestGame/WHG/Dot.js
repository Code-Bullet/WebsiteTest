class Dot {
  constructor(startingPos, dotType) {
      this.position = createVector(startingPos.x, startingPos.y);
      this.startingPos = createVector(startingPos.x, startingPos.y);
      this.diameter = tileSize / 2.0;
      this.dotType = dotType || "BouncingDot";
    }
    //------------------------------------------------------------------------------------------------------------
    //draws the dot
  show(isFaded) {
    fill(0, 0, 255);
    stroke(0);

    if(isFaded) {
      fill(0, 0, 255, 100);
      stroke(0, 0, 0, 100);

    }
    strokeWeight(4);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
    stroke(0);
  }


  //------------------------------------------------------------------------------------------------------------
  //returns true of the Pvectors define a square which collides with this dot
  collides(ptl, pbr) { //player dimensions
      var topLeft = createVector(this.position.x - this.diameter / 2, this.position.y - this.diameter / 2);
      var bottomRight = createVector(this.position.x + this.diameter / 2, this.position.y + this.diameter / 2);
      var playerSize = bottomRight.x - topLeft.x;
      if((ptl.x < bottomRight.x && pbr.x > topLeft.x) && (ptl.y < bottomRight.y && pbr.y > topLeft.y)) {

        if(dist(this.position.x, this.position.y, (ptl.x + pbr.x) / 2.0, (ptl.y + pbr.y) / 2.0) < this.diameter / 2 + sqrt(playerSize * playerSize * 2) / 2) {
          return true;
        }
      }
      return false;
    }
    //------------------------------------------------------------------------------------------------------------
    //returns the dot to its starting state

  move() {}
  reset() {}
  clone() {}

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class BouncingDot extends Dot {
  constructor(t1, t2) {
    super(createVector(t1.pixelPos.x + tileSize / 2, t1.pixelPos.y + tileSize / 2));

    this.speed = floor(tileSize / 6.6);

    this.velocity = createVector(t2.pixelPos.x - t1.pixelPos.x, t2.pixelPos.y - t1.pixelPos.y);
    this.velocity.normalize();
    this.velocity.mult(this.speed);
    this.startingVel = this.velocity.copy(); //createVector(this.velcocity.x, this.velocity.y);
    this.bouncers = [t1, t2];

    // this.bouncers[0] = t1;
    // this.bouncers[1] = t2;
    this.bounceWait = -1;
    this.bounceTimer = 3;
  }


  move() {
    for(var i = 0; i < this.bouncers.length; i++) {
      if(this.bounceTimer < 0 && dist(this.position.x, this.position.y, this.bouncers[i].pixelPos.x + tileSize / 2, this.bouncers[i].pixelPos.y + tileSize / 2) < this.speed) { //if reached bouncer
        this.bounceTimer = 3;
        this.bounceWait = 1; //wait 1 frames then change direction
      }
    }
    if(this.bounceWait == 0) {
      //change direction
      this.velocity.mult(-1);
    }
    this.position.add(this.velocity); //move dot
    this.bounceTimer--;
    this.bounceWait--;
  }

  resetDot() {
    this.position = this.startingPos.copy();
    this.velocity = this.startingVel.copy();
    this.bounceTimer = 3;
    this.bounceWait = -1;
  }


  //------------------------------------------------------------------------------------------------------------
  //returns a copy of this dot object
  clone() {
    var clone = new BouncingDot(this.bouncers[0], this.bouncers[1]);
    clone.velocity = this.velocity.copy();
    clone.position = this.position.copy();
    clone.startingVel = this.startingVel.copy();
    clone.bounceTimer = this.bounceTimer;
    clone.bounceWait = this.bounceWait;
    return clone;
  }



  print() {
    return("dots.push(new BouncingDot(tiles[" + int(this.bouncers[0].matrixPos.x) + "][" + int(this.bouncers[0].matrixPos.y) +
      "],tiles[" + int(this.bouncers[1].matrixPos.x) + "][" + int(this.bouncers[1].matrixPos.y) + "]));");
  }
}


class PathDot extends Dot {

  constructor(t1, t2, t3, t4, startingTile) {



    super(createVector(startingTile.pixelPos.x + tileSize / 2, startingTile.pixelPos.y + tileSize / 2), "PathDot");
    this.speed = tileSize / 15.0;
    this.velocity = startingTile.pixelPos.getUnitVectorInDirectionOf(t1.pixelPos);
    this.velocity.mult(this.speed);
    this.startingVel = this.velocity.copy();
    this.startingTile = startingTile;
    this.bouncers = [t1, t2, t3, t4];
    this.bounceTimer = 3;
  }

  //------------------------------------------------------------------------------------------------------------
  //moves the dot
  move() {

    for(var i = 0; i < this.bouncers.length; i++) {
      if(this.bounceTimer < 0 && dist(this.position.x, this.position.y, this.bouncers[i].pixelPos.x + tileSize / 2, this.bouncers[i].pixelPos.y + tileSize / 2) < 0.01) { //if reached bouncer
        this.bounceTimer = 3;
        this.turnDotRight();
        break;
      }
    }

    this.position.add(this.velocity); //move dot
    this.bounceTimer--;
  }
  turnDotRight() {
      if(this.velocity.x > 0 && this.velocity.y == 0) {
        this.velocity = createVector(0, 1.0 * this.speed);
      } else if(this.velocity.x == 0 && this.velocity.y > 0) {
        this.velocity = createVector(-1.0 * this.speed, 0);
      } else if(this.velocity.x < 0 && this.velocity.y == 0) {
        this.velocity = createVector(0, -1.0 * this.speed);
      } else if(this.velocity.x == 0 && this.velocity.y < 0) {
        this.velocity = createVector(1.0 * this.speed, 0);
      }

    }
    //---------------------------------------------------------------------------------------------------
    //returns true of the Pvectors define a square which collides with this dot
  resetDot() {
      this.position = this.startingPos.copy();
      this.velocity = this.startingVel.copy();
      this.bounceTimer = 3;
    }
    //------------------------------------------------------------------------------------------------------------
    //returns a copy of this dot object
  clone() {
    var clone = new PathDot(this.bouncers[0], this.bouncers[1], this.bouncers[2], this.bouncers[3], this.startingTile);
    clone.velocity = this.velocity.copy();
    clone.position = this.position.copy();
    clone.startingVel = this.startingVel.copy();
    clone.bounceTimer = this.bounceTimer;
    return clone;
  }


  print() {
    return("dots.push(new PathDot(" + this.bouncers[0].print() + ", " + this.bouncers[1].print() + ", " + this.bouncers[2].print() + ", " + this.bouncers[3].print() + ", " + this.startingTile.print() +
      "));");

  }
}


class SpiralDot extends Dot {
  constructor(position, rotateAround, speed) {
    super(position, "SpiralDot");
    this.speed = speed; //radians per frame
    this.rotateAround = rotateAround;

    let x = this.position.x - this.rotateAround.x;
    let y = this.position.y - this.rotateAround.y;
    if(x == 0) {
      if(y > 0) {
        this.angle = PI / 2;
      } else {
        this.angle = 3 * PI / 2;
      }
    } else {
      if(x >= 0 && y >= 0) {
        this.angle = atan(y / x);
      } else if(x >= 0 && y < 0) {
        this.angle = 2 * PI - atan(abs(y) / x);
      } else if(x < 0 && y < 0) {
        this.angle = PI + atan(abs(y) / abs(x));

      } else { //} if(x < 0 && y > 0) {
        this.angle = PI - atan(abs(y) / abs(x));
      }
    }
    // this.angle += PI / 4;
    // this.angle += PI / 16;
    // this.angle += PI / 32;


    this.movementRadius = dist(this.rotateAround.x, this.rotateAround.y, this.position.x, this.position.y);
  }
  move() {

    this.angle += this.speed;
    this.angle = this.angle % (2 * PI);

    this.position.x = this.rotateAround.x + cos(this.angle) * (this.movementRadius);
    this.position.y = this.rotateAround.y + sin(this.angle) * (this.movementRadius);

  }

  //---------------------------------------------------------------------------------------------------
  //returns true of the Pvectors define a square which collides with this dot
  resetDot() {
      this.position = this.startingPos.copy();
      let x = this.position.x - this.rotateAround.x;
      let y = this.position.y - this.rotateAround.y;
      if(x == 0) {
        if(y > 0) {
          this.angle = PI / 2;
        } else {
          this.angle = 3 * PI / 2;
        }
      } else {
        if(x >= 0 && y >= 0) {
          this.angle = atan(y / x);
        } else if(x >= 0 && y < 0) {
          this.angle = 2 * PI - atan(abs(y) / x);
        } else if(x < 0 && y < 0) {
          this.angle = PI + atan(abs(y) / abs(x));

        } else { //} if(x < 0 && y > 0) {
          this.angle = PI - atan(abs(y) / abs(x));
        }
      }
    }
    //------------------------------------------------------------------------------------------------------------
    //returns a copy of this dot object
  clone() {
    var clone = new SpiralDot(this.startingPos, this.rotateAround, this.speed);
    clone.position = this.position.copy();
    clone.angle = this.angle;
    return clone;
  }


  print() {
    return "dots.push(new SpiralDot(createVector(" + this.startingPos.x + "," + this.startingPos.y + "),createVector(" + this.rotateAround.x + "," + this.rotateAround.y + "), " + this.speed + "));";
  }

}


class Spiral {
  // constructor

  constructor(center, armLength, dotsPerArm, speed) {
    this.center = center;
    this.armLength = armLength;
    this.dpa = dotsPerArm;
    this.speed = speed || PI / 64;
    this.dots = [];

    this.dots.push(new SpiralDot(center, center, this.speed));
    this.addArm(createVector(0, 1));
    this.addArm(createVector(0, -1));
    this.addArm(createVector(1, 0));
    this.addArm(createVector(-1, 0));
  }

  addArm(direction) {
    var step = direction.copy();
    step.mult(this.armLength / this.dpa);
    var dotPoint = createVector(this.center.x, this.center.y);

    for(var i = 0; i < this.dpa; i++) {
      dotPoint.add(step);
      this.dots.push(new SpiralDot(dotPoint, this.center, this.speed));
    }
  }


  show() {
    for(var i = 0; i < this.dots.length; i++) {
      this.dots[i].show(true);
    }
  }

  move() {
    if(paused) {
      return;
    }
    for(var i = 0; i < this.dots.length; i++) {
      this.dots[i].move();
    }
  }

  enable() {
    for(var i = 0; i < this.dots.length; i++) {
      dots.push(this.dots[i]);
    }
  }

  changeDpa(newDpa) {
    this.dpa = newDpa;
    this.dots = [];
    this.dots.push(new SpiralDot(this.center, this.center, this.speed));
    this.addArm(createVector(0, 1));
    this.addArm(createVector(0, -1));
    this.addArm(createVector(1, 0));
    this.addArm(createVector(-1, 0));
  }
}
