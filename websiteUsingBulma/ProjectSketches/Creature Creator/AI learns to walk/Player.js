let maxJointAcceleration = 0.5;

//the player class holds the logic for each player, this means it has the box2d body and the brain and handles their functionality
class Player {

    constructor() {
        this.world = new b2World(new Vec2(0, 6), true);//each player has its own world
        this.world.SetContactListener(listener);//set listener  which is listening for contact with the ground to determine how many limbs it has on the ground

        this.score = 0;
        this.fitness = 0;
        this.gen = 0;


        this.vision = []; //the input array fed into the neuralNet
        this.decision = []; //the out put of the NN

        this.lifespan = 0; //how long the player lived for this.fitness
        this.bestScore = 0; //stores the this.score achieved used for replay

        this.dead = false;




        this.floorBody;// the floor body (created in the addBodiesAndSHitFromCreature())
        this.bodies = [];
        this.joints = [];
        this.jointSpeeds = [];//the current joint speeds of each joint, these values are controlled by the brain
        this.addBodiesAndShitFromCreature();


        this.stepsToLive = 10000;//so the players dont continue forever they die when this reaches 0
        this.startingX = this.getCenterOfMass().x;
        this.controllableJoints = this.joints.filter((b) => b.controlJoint).length;//get a list of all controllable joints, this is simply all joints but just in case i want to turn off certain joints later

        this.look();//in order to get the number of inputs we need for the genome we call the look function and see how many values populate the vision array

        this.genomeInputs = this.vision.length;//the number of inputs in the genome
        this.genomeOutputs = this.jointSpeeds.length;//the number of outputs in the genome
        this.brain = new Genome(this.genomeInputs, this.genomeOutputs);//the brain itself

        this.maxJointSpeed = 5;//joints will move at speeds in the range of -1*maxJointSPeed and 1* maxJointSpeed

        this.bestX = this.startingX;//keep track of the bestX value the player reaches in order to calculate the score
        this.touchingGround = false;//is the player currently touching the ground

        this.lifespan = 0; //how long the player lived

        this.justDiedFromLazer = false;
        this.deathCounter = 100;//when the player dies it turns into a trasparent red blob and once this timer hits 0 its fully dead


        this.isOnScreen = false;
        this.isShowing = false;

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //draws the creature to the screen if it isn't dead
    show() {

        if (!this.dead) {
            this.isOnScreen = false;
            push();
            translate(panX, panY);

            //draw all the bodies to the screen
            for (var i = 0; i < this.bodies.length; i++) {

                this.bodies[i].show();
                if (this.bodies[i].isOnScreen) {
                    this.isOnScreen = true;
                }
            }

            pop();

            this.isShowing = true;
        }

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //sets the joint speed of each joint based on the outputs of the brain
    move() {

        let counter = 0;
        for (var j of this.joints) {
            if (j.type === "revolute" && j.controlJoint) {
                //for each joint

                let jointSpeed = this.jointSpeeds[counter];
                let simulatedEase = false;
                //if the joint is limited then decrease the velocity of the joint as it reaches the limits so it looks more natural
                if (j.limitRevolution) {

                    let upperLim = j.joint.GetUpperLimit();
                    let lowerLim = j.joint.GetLowerLimit();
                    let jointRange = upperLim - lowerLim;
                    let jointAngle = j.joint.GetJointAngle();

                    //if the joint is near the limit then slow the joint speed down to simulate ease in and out
                    let previousJointSpeed = jointSpeed;

                    if (jointSpeed < 0) {
                        if (jointAngle - lowerLim < 0.2 * jointRange) {
                            if (jointAngle < lowerLim) {
                                jointSpeed = 0;
                                simulatedEase = true;
                            } else {
                                jointSpeed = map(jointAngle - lowerLim, 0, 0.2 * jointRange, this.jointSpeeds[counter], 0);
                                simulatedEase = true;
                            }
                        }

                    } else {

                        if (upperLim - jointAngle < 0.2 * jointRange) {
                            if (upperLim < jointAngle) {
                                jointSpeed = 0;
                                simulatedEase = true;
                            } else {
                                jointSpeed = map(upperLim - jointAngle, 0, 0.2 * jointRange, 0, this.jointSpeeds[counter]);
                                simulatedEase = true;
                            }
                        }


                    }

                }


                //if the joint hasnt already had simulated ease applied because its close to the limits then limit the joints acceleration so it looks more natural
                if (!simulatedEase && Math.abs(j.motorSpeed - jointSpeed) > maxJointAcceleration) {
                    if (jointSpeed > j.motorSpeed) {
                        jointSpeed = j.motorSpeed + maxJointAcceleration;
                    } else {
                        jointSpeed = j.motorSpeed - maxJointAcceleration;
                    }
                }

                j.setMotorSpeed(jointSpeed);
                counter += 1;
            }
        }

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //called every frame
    update() {
        this.lifespan++;
        //decrease steps to live and kill it if its less than 0
        if (!this.dead) {
            this.stepsToLive -= 1;
        }
        if (this.stepsToLive <= 0) {
            this.dead = true;
        }

        //progress the box2d world
        this.world.Step(1 / 30, 10, 10);

        //if the player is currently in the death animation phase (i.e.is red and transparent because it hit the lazer) then decrement the death counter and if it hits 0 then kill the player
        if (this.justDiedFromLazer) {
            if (this.deathCounter > 0) {
                this.deathCounter--;
            } else {
                this.dead = true;
            }
            return;
        }

        //get the center of mass and see if the player has progressed further than its previous bestX
        let centerOfMass = this.getCenterOfMass();

        if (!this.justDiedFromLazer && this.bestX < centerOfMass.x) {
            this.bestX = centerOfMass.x;
            this.score = this.bestX - this.startingX;
        }


        //set the joint speeds
        this.move();

        //if any bodies have the deathIfTouchesGround property and if that body is touching the ground kill the player
        if (!this.justDiedFromLazer) {
            for (let b of this.bodies) {
                if (b.touchingGround && b.deathIfTouchesGround) {
                    this.dead = true;
                    this.deathCounter = -1;
                }
            }
        }

        //check if the player is hit by the lazer
        let lazerX = (-10 + deathLazerSpeed * this.lifespan / 100.0) * SCALE;
        let hitByLazer = false;
        for (let b of this.bodies) {
            for (let f of b.fixtures) {
                if (f.hitByLazer(lazerX)) {
                    hitByLazer = true;
                    break;
                }
            }
            if (hitByLazer) {
                break;
            }

        }

        //if the player was hit by the lazer this frame then play a sound and kill the player
        if (hitByLazer) {
            if (this.isShowing && !muted) {
                lazerShot.play();
                burnedPlayer.play();
            }


            if (!showDeath) {
                this.dead = true;
                this.deathCounter = -1;
            } else {
                //if showing death then remove all joints from the creature and set each body part to dead
                this.justDiedFromLazer = true;
                for (var j of this.joints) {
                    this.world.DestroyJoint(j.joint);
                }
                for (var b of this.bodies) {
                    b.isDead = true;
                }
            }
        }


    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    //gets input for the NN from its environment
    //populates the vision array
    look() {
        this.vision = [];

        //-------------------------------------------angles and speeds of revolute joints
        let jointAngles = [];
        let inputJointSpeeds = [];
        for (var j of this.joints) {
            if (j.type === "revolute") {
                if (j.limitRevolution) {// if limited then map 0 and 1 to the limits
                    let upperLim = j.joint.GetUpperLimit();
                    let lowerLim = j.joint.GetLowerLimit();
                    let jointAngle = constrain(j.joint.GetJointAngle(), lowerLim, upperLim);//make sure the angle is within the limit (sometimes the physics engine can be a little fucky)
                    this.vision.push(map(jointAngle, lowerLim, upperLim, 0, 1));
                } else {
                    jointAngles.push(j.joint.GetJointAngle());
                }

                inputJointSpeeds.push(j.joint.GetJointSpeed());

            }
        }


        //add the joint angles to the vision array
        for (var j of jointAngles) {
            let val = j;
            while (val < 0) {
                val += 2 * PI;
            }
            val %= 2 * PI;
            this.vision.push(map(val, 0, 2 * PI, 0, 1));
        }

        //add the joint speeds to the vision array
        for (var j of inputJointSpeeds) {
            let val = j;
            val = val / this.maxJointSpeed;
            // this.vision.push(val);
        }


        //-------------------------------------------if touching ground


        let bodyTouchingGroundCounter = this.bodies.filter((b) => b.touchingGround).length;
        this.vision.push(bodyTouchingGroundCounter / this.bodies.length);

        for (let b of this.bodies) {
            if (b.untouchGroundNextFrame) {
                b.touchingGround = false;
                b.untouchGroundNextFrame = false;
            }
        }

        //-------------------------------------------rotation of the body
        //the rotation needs to be relative to the mass of the object
        let bodyMasses = [];
        let totalMass = 0;
        for (let b of this.bodies) {
            bodyMasses.push(b.body.GetMass());
            totalMass += b.body.GetMass();
        }

        let averageRotationRelativeToMass = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            let val = getAngleBetween0and2PI(this.bodies[i].body.GetAngle());
            let angle = getAngleBetween0and2PI(this.bodies[i].angle);
            //get the difference between the current angle and the stating angle
            let angleDiff = val - angle;

            //now we want that difference to be in range (-PI,PI)

            if (angleDiff > PI) {
                angleDiff -= 2 * PI;
            } else if (angleDiff < -PI) {
                angleDiff += 2 * PI;
            }

            //now we need to calculate the effeted difference based on it mass
            let rotationMass = bodyMasses[i] * angle / totalMass;
            averageRotationRelativeToMass += rotationMass;
        }

        this.vision.push(map(averageRotationRelativeToMass, -PI, PI, -1, 1));

        //-------------------------------------------height off the ground based on weight
        //essentially get the height of the center of mass of the entire creature
        let heightOfCenterOfMass = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            let height = this.bodies[i].body.GetWorldCenter().y;
            height = abs(height - this.floorBody.body.GetPosition().y);
            heightOfCenterOfMass += bodyMasses[i] * height / totalMass;
        }
        this.vision.push(map(heightOfCenterOfMass, 0, 7, 0, 1));


        //-------------------------------------------verticle velocity of the creature
        //again it should be relative to the mass of each body part so it cant just fling a leg up and be like "im flying"
        bodyMasses = [];
        totalMass = 0;
        for (let b of this.bodies) {
            bodyMasses.push(b.body.GetMass());
            totalMass += b.body.GetMass();
        }

        let averageVertVelRelativeToMass = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            let val = this.bodies[i].body.GetLinearVelocity().y;

            averageVertVelRelativeToMass += bodyMasses[i] * val / totalMass;
        }
        this.vision.push(map(averageVertVelRelativeToMass, -5, 5, -1, 1));


        //-------------------------------------------angular velocity of creature
        //again based on mass
        bodyMasses = [];
        totalMass = 0;
        for (let b of this.bodies) {
            bodyMasses.push(b.body.GetMass());
            totalMass += b.body.GetMass();
        }

        let averageAngularVelRelativeToMass = 0;
        for (let i = 0; i < this.bodies.length; i++) {
            let val = this.bodies[i].body.GetAngularVelocity();

            averageAngularVelRelativeToMass += bodyMasses[i] * val / totalMass;
        }
        this.vision.push(map(averageAngularVelRelativeToMass, -1.5, 1.5, -1, 1));

    }

    //gets the center of mass of the creature
    getCenterOfMass() {
        let bodyMasses = [];
        let totalMass = 0;
        for (let b of this.bodies) {
            bodyMasses.push(b.body.GetMass());
            totalMass += b.body.GetMass();
        }

        let centerOfMass = createVector(0, 0);
        for (let i = 0; i < this.bodies.length; i++) {
            let pos = this.bodies[i].body.GetWorldCenter();
            centerOfMass = createVector(centerOfMass.x + pos.x * bodyMasses[i] / totalMass, centerOfMass.y + pos.y * bodyMasses[i] / totalMass);
        }

        return centerOfMass;
    }


    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //gets the output of the brain then converts them to actions, i.e. populates the jointSpeeds array
    think() {


        //get the output of the neural network
        this.decision = this.brain.feedForward(this.vision);

        for (var i = 0; i < this.decision.length; i++) {

            let jointSpeed = map(this.decision[i], 0, 1, -this.maxJointSpeed, this.maxJointSpeed);
            this.jointSpeeds[i] = jointSpeed;

        }
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a clone of this player with the same brian
    clone() {
        var clone = new Player();
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = max(this.score, this.bestScore);
        clone.parent = this;
        return clone;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
    //this fuction does that

    cloneForReplay() {
        var clone = new Player();
        clone.brain = this.brain.clone();
        clone.fitness = this.fitness;
        clone.brain.generateNetwork();
        clone.gen = this.gen;
        clone.bestScore = max(this.score, this.bestScore);

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
        return clone;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //fot Genetic algorithm
    calculateFitness() {
        let distance = this.bestX - this.startingX;
        if (distance < 0) {
            distance = 0;
        }
        this.fitness = distance * distance;
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a child which is a crossover of this player and the argument player
    crossover(parent2) {

        var child = new Player();
        child.brain = this.brain.crossover(parent2.brain);
        child.brain.generateNetwork();
        return child;
    }

    //adds bodies and joints from the creature object to this players box2d world
    //also adds the floorbody
    addBodiesAndShitFromCreature() {
        let friction = 0.8;


        this.floorBody = new Body(-100, 764, 0, false, this.world);
        this.floorBody.addRectFixture(-531, -15, 120070, 120, 0);
        this.floorBody.fixtures[0].setValues(friction, 1, 0.44999999999999996);
        this.floorBody.id = "ground";


        for (let b of creatureObject.bodies) {
            this.addBodyFromObject(b);

        }
        for (let j of creatureObject.joints) {
            this.addJointFromObject(j);
        }

        for (var j of this.joints) {
            if (j.type === "revolute") {
                j.setAsControlJoint();
                this.jointSpeeds.push(0);
            }
        }
    }


    //adds the argument body to this players box2d world
    //also adds all images
    addBodyFromObject(obj) {
        const {x, y, angle, isDynamic} = obj;
        let body = new Body(x, y, angle, isDynamic, this.world);
        body.deathIfTouchesGround = obj.deathIfTouchesGround;
        //add each fixture
        for (let f of obj.fixtures) {
            switch (f.fixtureType) {
                case "rectangle":
                    body.addRectFixture(f.x, f.y, f.w, f.h, f.angle);

                    break;
                case "circle":
                    body.addCircleFixture(f.x, f.y, f.radius);
                    break;
                case "compound":

                    let newPixelVectorPositions = [];
                    for (let vec of f.pixelVectorPositions) {
                        newPixelVectorPositions.push(createVector(vec.x, vec.y));
                    }

                    body.addArrayFixture(newPixelVectorPositions);

                    //commented way might be quicker
                    // if(f.fixtures.length>0){
                    //   let fixture = new CompoundFixture(f.fixtures[0].pixelVectorPositions);
                    //   for(let arrFix of f.fixtures){
                    //     fixture.addArrayFixture(arrFix);
                    //   }
                    //   fixture.addToBody(this);
                    //   this.fixtures.push(fixture);
                    // }
                    break;
            }
            //add the color of the fixture
            if (f.fillColor.toString() === color(240, 150).toString()) {
                body.fixtures[body.fixtures.length - 1].fillColor = fillColor;
            } else {

                body.fixtures[body.fixtures.length - 1].fillColor = f.fillColor;
            }
        }
        //add all body images
        for (let bodyImage of obj.bodyImages) {
            let newBodyImage = new BodyImage(bodyImage.image, bodyImage.x, bodyImage.y, bodyImage.w, bodyImage.h);
            newBodyImage.angle = bodyImage.angle;
            newBodyImage.addToBody(body);
        }
        //add the collision logic
        body.categoryBits = obj.categoryBits;
        body.categoryMask = obj.categoryMask;

        body.resetFilterData();

        this.bodies.push(body);

    }

    //adds the argument joint to this players box2d world
    addJointFromObject(obj) {
        const {type, anchorX, anchorY, body1No, body2No, limitRevolution, upperLimit, lowerLimit} = obj;
        if (type !== "revolute") {
            return;
        }
        let body1 = this.bodies[body1No];
        let body2 = this.bodies[body2No];

        let joint = new RevoluteJoint(body1, body2, anchorX, anchorY, this.world);

        //set limits
        if (limitRevolution) {
            joint.setUpperLimit(upperLimit);
            joint.setLowerLimit(lowerLimit);
            joint.enableLimits(true);
        }
        joint.setValues(true, 0, 1000);
        this.joints.push(joint);
    }


}

//ensures an angle is between 0 and 2*PI
function getAngleBetween0and2PI(angle) {

    while (angle < 0) {
        angle += 2 * PI;
    }
    angle %= 2 * PI;
    return angle;

}

//this listener listen for contact between a body and the ground
var listener = new Box2D.Dynamics.b2ContactListener;

listener.BeginContact = function (contact) {

    let world = contact.GetFixtureA().GetBody().GetWorld();
    let objectA = contact.GetFixtureA().GetBody().GetUserData();
    let objectB = contact.GetFixtureB().GetBody().GetUserData();
    if (objectB.id === "ground") {
        objectA.touchingGround = true;

    } else if (objectA.id === "ground") {
        objectB.touchingGround = true;
    }
};

listener.EndContact = function (contact) {

    let world = contact.GetFixtureA().GetBody().GetWorld();
    let objectA = contact.GetFixtureA().GetBody().GetUserData();
    let objectB = contact.GetFixtureB().GetBody().GetUserData();
    if (objectB.id === "ground") {
        if (objectA.deathIfTouchesGround) {
            return;
        }
        objectA.untouchGroundNextFrame = true;
    } else if (objectA.id === "ground") {
        if (objectB.deathIfTouchesGround) {
            return;
        }
        objectB.untouchGroundNextFrame = true;

    }

};
