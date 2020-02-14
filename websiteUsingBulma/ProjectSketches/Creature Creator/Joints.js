//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//revolute joints are joints which connect 2 bodies at a single point which can rotate,
//think of them like motors
//this is actually how the creatures move around and its these movements which are optimised so that bad boy can learn to walk
class RevoluteJoint {

    //the constructor will need 2 bodyies a anchor position(the position of the joint itself) and (optional) a box2d world that the joint should be placed in
    constructor(body1, body2, anchorX, anchorY, worldParameter) {
        this.anchor = new Vec2(anchorX / SCALE, anchorY / SCALE);//the anchor is the position of the joint (in world coordinates)
        //define the revolute joint
        this.revJointDef = new b2RevoluteJointDef();
        this.revJointDef.Initialize(body1.body, body2.body, this.anchor);

        //by default no limits are added to the joint
        this.limitRevolution = false;
        this.lowerLimit = -Math.PI / 4.0;
        this.upperLimit = Math.PI / 4.0;

        this.joint = null;//the box2d joint object

        //the bodies this joint joins
        this.body1 = body1;
        this.body2 = body2;

        //selection variables used by various modes to edit this joint
        this.selected = false;
        this.lookLikeSelected = false;
        this.selectedLimit = -1;


        if (worldParameter) {//if the box2dWorld parameter is not null then this joint has its own box2dWorld
            this.world = worldParameter;
        } else { //otherwise it uses the global box2dWorld
            this.world = world.box2dWorld;
        }
        this.addToWorld();//add the joint to the world, this sets this.joint


        this.type = "revolute";//not really used but i have it here just incase i want to add distance joints, which kinda are like muscles

        //motor variables
        this.motorSpeed = 0;
        this.motorTorque = 0;

        this.controlJoint = false;//another kinda useless variable for allowing you to turn off the players ability to control this joint, this functionality was not included in the final thing

    }

    //converts the information into an object (like a JSON), used to pass the creatures joint info to the NEAT algorithm
    getJointInfoAsObject() {
        let obj = {
            type: "", anchorX: 0, anchorY: 0, body1No: 0, body2No: 0, limitRevolution: 0, upperLimit: 0,
            lowerLimit: 0
        };
        Object.assignMatching(obj, this);
        obj.body1No = creature.getBodyNo(this.body1);
        obj.body2No = creature.getBodyNo(this.body2);
        let anchor = this.getPixelCoordinatesOfAnchor();
        obj.anchorX = anchor.x;
        obj.anchorY = anchor.y;
        return obj;
    }

    //sets the upper limit of the joint and ensures that its within +0 and +2*PI of the lower joint
    setUpperLimit(limit) {


        if (this.lowerLimit > limit) {
            limit += 2 * Math.PI;
        } else if (limit - this.lowerLimit > 2 * Math.PI) {
            limit -= 2 * Math.PI;
        }
        this.limitRevolution = true;
        this.upperLimit = limit;
        this.revJointDef.upperAngle = limit;
        this.revJointDef.enableLimit = true;

    }

    //sets the lower limit of the joint and ensures that its within -0 and -2*PI of the upper joint
    setLowerLimit(limit) {
        if (this.upperLimit < limit) {
            limit -= 2 * Math.PI;
        } else if (this.upperLimit - limit > 2 * Math.PI) {
            limit += 2 * Math.PI;
        }
        this.limitRevolution = true;
        this.lowerLimit = limit;
        this.revJointDef.lowerAngle = limit;
        this.revJointDef.enableLimit = true;
    }


    //enables limits for this joint and sets the upper and lower limit
    enableLimits(enabled) {
        this.limitRevolution = enabled;
        this.revJointDef.enableLimit = enabled;
        if (enabled) {
            this.setUpperLimit(this.upperLimit);
            this.setLowerLimit(this.lowerLimit);
        }
        this.reset();
    }

    //switches body1 and body2, this is used for changing the focus body when limiting a joint
    switchBodies() {
        let temp = this.body1;
        this.body1 = this.body2;
        this.body2 = temp;
        this.reset();
    }

    //resets the position of an anchor
    setPositionOfAnchor(anchorNo, newPosition) {
        this.anchor = new Vec2((newPosition.x - getPannedOffset().x) / SCALE, (newPosition.y - getPannedOffset().y) / SCALE);
        this.reset();
    }


    //gets the position the joint is on the screen in pixels
    getPixelCoordinatesOfAnchor(anchorNo) {
        let x = this.anchor.x * SCALE + getPannedOffset().x;
        let y = this.anchor.y * SCALE + getPannedOffset().y;
        return createVector(x, y);

    }

    //essentially the same as the getPixelCoordinatesOfAnchor
    //its a different thing because distance joints have 2 different anchors to the center would be the average of the 2
    //anywhay thats why this exists.
    getPixelCenter() {
        let anchorPoint = createVector(this.anchor.x * SCALE, this.anchor.y * SCALE);
        let pixelCenter = p5.Vector.add(anchorPoint, getPannedOffset()); //windowOffset)
        return pixelCenter;
    }

    //add the joint to the box2d world, making it a real thing
    addToWorld() {
        this.joint = this.world.CreateJoint(this.revJointDef);
    }

    //enable the joint motor in the box2d world
    enableMotor() {
        this.joint.EnableMotor(true);
    }

    //disables the joint motor in the box2d world
    disableMotor() {
        this.joint.EnableMotor(false);
    }

    //sets the motor enabled in the box2d world
    setMotorEnabled(val) {
        this.joint.EnableMotor(val);
    }

    //again this bad boy is fuckin useless but here she is
    setAsControlJoint() {
        this.controlJoint = true;
    }

    setMotorSpeed(val) {

        this.joint.SetMotorSpeed(val);
        this.motorSpeed = val;
    }

    setMaxTorque(val) {
        this.joint.SetMaxMotorTorque(val);
        this.motorTorque = val;
    }

    setValues(enabled, speed, torque) {
        this.setMotorEnabled(enabled);
        this.setMotorSpeed(speed);
        this.setMaxTorque(torque);
    }

    //shows the joint and if the joint has limits, show them (maybe)
    show() {
        push();

        let anchor1 = this.joint.GetAnchorA();
        translate(anchor1.x * SCALE, anchor1.y * SCALE);

        //show the limit arc
        if (this.limitRevolution && (showJointLimits || this.selectedLimit !== -1) && !buttonManager.areCosmeticsActive()) {

            //create a vector from the anchor to body 2
            let anchorPos = this.getPixelCoordinatesOfAnchor(0);
            let body2Pos = createVector(this.body2.x, this.body2.y);
            let anchorToBody2 = p5.Vector.sub(body2Pos, anchorPos);

            //get this angle of this vector
            let angleBetweenBodies = anchorToBody2.heading();
            let angleFromVertical = Math.PI / 2.0 + angleBetweenBodies;

            //rotate by body1s angle
            rotate(this.body1.body.GetAngle() - this.body1.angle);
            //then by the angle between the anchor and the body2
            rotate(angleFromVertical);
            translate(-0.6, -0.6);

            let lowLim = createVector(-3, -100).rotate(this.lowerLimit);
            let upLim = createVector(3, -100).rotate(this.upperLimit);

            let temp = createVector().set(lowLim).mult(0.3);
            stroke(100, 100, 255, 100);
            temp.rotate(Math.PI / 100);
            while (temp.isBetweenVectors(lowLim, upLim)) {
                line(0, 0, temp.x, temp.y);
                temp.rotate(Math.PI / 100);
            }

            //show the limit lines if they are selected
            strokeWeight(1);
            stroke(0, 150);//,100,155);

            if (this.selectedLimit !== -1) {
                line(0, 0, lowLim.x, lowLim.y);
                line(0, 0, upLim.x, upLim.y);
            }
            strokeWeight(3);
            stroke(255, 255, 0);
            if (this.selectedLimit === 0)
                line(0, 0, lowLim.x, lowLim.y);
            else if (this.selectedLimit === 1)
                line(0, 0, upLim.x, upLim.y);

        }

        //show the little dot for the joitn
        stroke(outlineColor);
        fill(0, 0, 0);
        if (this.selected || this.lookLikeSelected) {

            stroke(255, 255, 0);
            if (buttonManager.isInMode("Delete")) {
                stroke(255, 0, 0);
            }

            strokeWeight(2);
            ellipse(0, 0, 7);

        } else {
            ellipse(0, 0, 5);
        }

        pop();

    }


    //moves the selected limit to the mouse position. essentially rotates that baby to face the mouse position
    moveSelectedLimitToMousePosition() {

        let anchorPos = this.getPixelCoordinatesOfAnchor(0);
        let anchorToMouse = createVector(mouseX - anchorPos.x, mouseY - anchorPos.y);


        //create a vector from the anchor to body 2

        let body2Pos = createVector(this.body2.x, this.body2.y);
        let anchorToBody2 = p5.Vector.sub(body2Pos, anchorPos);

        //get this angle of this vector
        let angleBetweenBodies = anchorToBody2.heading();
        let angleFromVertical = Math.PI / 2.0 + angleBetweenBodies;

        //rotate by body1s angle
        // let mousePosRotatedByBody1Angle = anchorToMouse.rotate(-this.body1.body.GetAngle());
        //then by the angle between the anchor and the body2
        let relativeMousePos = anchorToMouse.rotate(-angleFromVertical);
        if (this.selectedLimit === 0) {

            // let dif = this.lowerLimit - relateMousePos.heading
            this.setLowerLimit(relativeMousePos.heading() + Math.PI / 2);

        } else {
            this.setUpperLimit(relativeMousePos.heading() + Math.PI / 2);
        }

        this.reset();
    }

    //selects the limit which is closest to the mouses position
    selectLimitClosestToMousePosition() {


        let anchorPos = this.getPixelCoordinatesOfAnchor(0);
        let anchorToMouse = createVector(mouseX - anchorPos.x, mouseY - anchorPos.y);


        //create a vector from the anchor to body 2

        let body2Pos = createVector(this.body2.x, this.body2.y);
        let anchorToBody2 = p5.Vector.sub(body2Pos, anchorPos);

        //get this angle of this vector
        let angleBetweenBodies = anchorToBody2.heading();
        let angleFromVertical = Math.PI / 2.0 + angleBetweenBodies;


        //then by the angle between the anchor and the body2
        let relativeMousePos = anchorToMouse.rotate(-angleFromVertical);

        let lowLim = createVector(-3, -100).rotate(this.lowerLimit);
        let upLim = createVector(3, -100).rotate(this.upperLimit);

        if (dist(lowLim.x, lowLim.y, relativeMousePos.x, relativeMousePos.y) < dist(upLim.x, upLim.y, relativeMousePos.x, relativeMousePos.y)) {
            this.selectedLimit = 0;
        } else {
            this.selectedLimit = 1;
        }


        //if another joint is moused over then also look like its selected.


        let minIndex = -1;
        let min = 100000;


        for (var i = 0; i < creature.joints.length; i++) {
            let pos = creature.joints[i].getPixelCenter();
            let distance = dist(mouseX, mouseY, pos.x, pos.y);
            if (distance < min && distance < 8) {
                min = distance;
                minIndex = i;
            }
        }


        if (minIndex !== -1 && minIndex != creature.selectedJoint) {
            creature.joints[minIndex].lookLikeSelected = true;
        }


    }

    //remove the joint from the box2d world
    remove() {
        if (this.joint != null) {
            this.world.DestroyJoint(this.joint);
        }
    }

    //destroy the joint then recreate it with the current variables
    reset() {
        if (this.joint != null) {
            this.world.DestroyJoint(this.joint);
        }
        this.revJointDef.Initialize(this.body1.body, this.body2.body, this.anchor);
        this.addToWorld();
        this.joint.SetMotorSpeed(this.motorSpeed);
        this.joint.SetMaxMotorTorque(this.motorTorque);
        this.joint.EnableMotor(this.enableMotor);
    }

}

//used to tell if a vector is between 2 other vectors a and b
p5.Vector.prototype.isBetweenVectors = function (a, b) {
    let aAngle = a.heading();
    let bAngle = b.heading();
    if (aAngle > bAngle) {
        aAngle -= 2 * Math.PI;

    }

    let thisAngle = this.heading();
    if (thisAngle >= aAngle && thisAngle <= bAngle) {
        return true;
    }
    thisAngle -= 2 * PI;
    if (thisAngle >= aAngle && thisAngle <= bAngle) {
        return true;
    }
    return false;


};