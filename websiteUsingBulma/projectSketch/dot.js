class Dot {
    constructor() {
        this.visible = true;
        this.opacity = 255;
        this.pos = createVector(random(canvas.width), random(canvas.height));

        this.target;
        this.vel = createVector();

        this.reached = false;
        this.r = 20;
        this.g = 20;


        this.b = 20;
        this.targetSet = false;
        this.targetR = 0;
        this.targetG = 0;

        this.targetB = 0;


        this.colorVel = {r: 0, g: 0, b: 0};
        this.speed = random(0.02, 0.025);

        this.expectedTime = Math.ceil(1 / this.speed);
        this.moveTimer = 0;

        this.waitCount = 0;
        this.justReached = false;

    }

    setTarget(targetX, targetY, targetR, targetG, targetB, firstTarget) {

        if (targetX % 20 === 0)
            this.visible = false;
        else
            this.visible = true;
        if (finishFromLeft) {
            this.speed = map(targetX, 0, canvas.width, 0.02, 0.015);
        } else {
            this.speed = map(targetX, 0, canvas.width, 0.015, 0.02);
        }

        // this.speed = 0.03;
        this.expectedTime = 1 / this.speed;



        if (startFromLeft)
            this.waitCount = map(this.pos.x, 0, canvas.width, 0, 15);
        else
            this.waitCount = map(this.pos.x, 0, canvas.width, 15, 0);


        //if this is the first target
        if(!this.target){
            this.waitCount=0;
        }
        this.expectedTime -=this.waitCount;
        this.speed = 1/this.expectedTime;
        this.waitCount += Math.floor(random(5));





        this.target = createVector(targetX, targetY);
        this.targetR = targetR;
        this.targetG = targetG;
        this.targetB = targetB;


        this.vel = createVector();
        this.vel.x = this.target.x - this.pos.x;
        this.vel.y = this.target.y - this.pos.y;
        this.vel.mult(this.speed);//takes 100 frames to get to destination

        //set color vel
        this.colorVel.r = (this.targetR - this.r) * this.speed;
        this.colorVel.g = (this.targetG - this.g) * this.speed;
        this.colorVel.b = (this.targetB - this.b) * this.speed;

        //reset variables
        this.reached = false;
        this.moveTimer = 0;





        // this.waitCount=0;
    }

    move() {
        if (!this.reached) {
            this.waitCount-=frameRateRatio;
            if (this.waitCount > 0) {
                return;
            }
            this.moveTimer += frameRateRatio;
            this.pos.x += this.vel.x * frameRateRatio;
            this.pos.y += this.vel.y * frameRateRatio;


            this.r += this.colorVel.r * frameRateRatio;
            this.g += this.colorVel.g * frameRateRatio;
            this.b += this.colorVel.b * frameRateRatio;


            if (this.moveTimer >= this.expectedTime) {
                this.reached = true;
                this.justReached = true;
                this.pos = this.target.copy();
                this.r = this.targetR;
                this.g = this.targetG;
                this.b = this.targetB;
            }
        }
    }


    show(min, max) {
        //if this dots X position is greater that the max unreachable x then dont draw it because its not going to be erased.
        if (!this.justReached && (this.reached || this.waitCount > 0) && (this.pos.x > max + 10 || this.pos.x < min - 10)) {
            showing--;
            return;
        }
        this.justReached = false;
        noStroke();
        if (this.reached || this.waitCount >= 0 || this.visible) {
            fill(this.r, this.g, this.b);
            rect(this.pos.x + 1, this.pos.y + 1, roundedScale - 2, roundedScale - 2);

        } else if (this.expectedTime < this.moveTimer + 2) {
            let opacity = map(this.expectedTime - this.moveTimer, 0, 3, 255, 0);
            fill(this.r, this.g, this.b);

            rect(this.pos.x + 1, this.pos.y + 1, roundedScale - 2, roundedScale - 2);

        } else {
            showing--;
        }



    }


    clone() {
        var clone = new Dot(this.target.x, this.target.y);
        return clone;
    }


}
