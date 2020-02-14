//this class holds the bodies and joints and handles the logic for them

class Creature {
    constructor() {
        this.bodies = [];//list of body objects that create the creature
        this.joints = [];//list of joint objects that create the creature
        this.selectedJoint = -1;
        this.selectedBody = -1;
        this.selectedBodyToEditCosmetically = -1;
    }


    //draws the creature to the screen
    show() {
        push();
        translate(panX, panY);
        for (let b of this.bodies) {
            b.show();
        }
        for (let j of this.joints) {
            j.show();
        }
        pop();
    }


    update() {
    }

    //adds a body shape to the creature
    addBody(body) {
        this.bodies.push(body);
    }

    //adds a joint to the creature
    addJoint(joint) {
        this.joints.push(joint);
    }

    //returns the body object which is currently selected
    getSelectedBody() {
        if (this.selectedBody !== -1) {
            return this.bodies[this.selectedBody];
        }
        return null;
    }

    //returns the joint object which is currently selected
    getSelectedJoint() {
        if (this.selectedJoint !== -1) {
            return this.joints[this.selectedJoint];
        }
        return null;
    }

    //unselects all bodies
    unselectAllBodies() {
        for (let b of this.bodies) {
            b.selectedAsShape1 = false;
            b.selected = false;
        }
        this.selectedBody = -1;
    }



    unselectEverythingExceptForSelectedAsShape1s() {
        for (let b of this.bodies) {
            b.selected = false;
        }
        this.selectedBody = -1;

        for (let j of this.joints) {
            j.selected = false;
            j.selectedJoint = -1;
        }

        this.selectedJoint = -1;
    }

    //unselects all joints
    unselectAllJoints() {
        for (let j of this.joints) {
            j.selected = false;
            j.selectedJoint = -1;
        }

        this.selectedJoint = -1;
    }

    //unselects all joints and bodies
    unselectEverything() {
        this.unselectAllBodies();
        this.unselectAllJoints();
    }

    //removes all joints attached to body which has recently been destroyed
    removeJointsAttachedToADestroyedBody() {
        for (var i = 0; i < this.joints.length; i++) {
            if (this.joints[i].body1.removed || this.joints[i].body2.removed) {
                this.joints[i].remove();
                this.joints.splice(i, 1);
                i -= 1;
            }
        }
    }

    //resets all joints attached to this body.
    //used when the body is moved/ rotated
    resetJointsAttachedToBody(body) {
        for (var i = 0; i < this.joints.length; i++) {
            if (this.joints[i].body1 === body || this.joints[i].body2 === body) {
                this.joints[i].reset();
            }
        }
    }

    //returns the index of the argument body
    getBodyNo(body) {
        for (var i = 0; i < this.bodies.length; i++) {
            if (this.bodies[i] === body) {
                return i;
            }
        }
        return -1;
    }

    //adds all the fixtures in body2 to body1 and deletes body 2
    fuseBodies(bodyNo1, bodyNo2) {
        for (let bodyImage of this.bodies[bodyNo2].bodyImages) {
            bodyImage.addToNewBody(this.bodies[bodyNo1]);
        }

        this.bodies[bodyNo1].addAllFixturesAndJointsFromBody(this.bodies[bodyNo2]);
        this.bodies[bodyNo2].remove();
        this.bodies.splice(bodyNo2, 1);
    }


    //select a joint the mouse is over
    selectJointMouseIsOver() {
        this.unselectEverything();

        let minIndex = -1;
        let min = 100000;


        for (let i = 0; i < this.joints.length; i++) {
            let pos = this.joints[i].getPixelCenter();
            let distance = dist(mouseX, mouseY, pos.x, pos.y);
            if (distance < min && distance < 5) {
                min = distance;
                minIndex = i;
            }
        }

        this.selectJoint(minIndex);

    }

    //select a body or joint the mouse is over
    selectBodyOrJointMouseIsOver() {
        this.unselectEverything();

        let minIndex = -1;
        let min = 100000;
        let selectJoint = false;
        let distance = 0;
        //check bodies
        for (let i = 0; i < this.bodies.length; i++) {
            let pos = this.bodies[i].getPixelCoordinates();
            distance = dist(mouseX, mouseY, pos.x, pos.y);
            if (distance < min && this.bodies[i].isShiftedPixelPosWithinFixtures(getShiftedMousePos())) {
                min = distance;
                minIndex = i;
            }
        }

        //check joints
        for (let i = 0; i < this.joints.length; i++) {
            let pos = this.joints[i].getPixelCenter();
            distance = dist(mouseX, mouseY, pos.x, pos.y);
            if (distance < min && distance < 5) {
                //if a joint is closer to the mouse than the closest body then select it.
                min = distance;
                minIndex = i;
                selectJoint = true;
            }
        }

        //select the closest shit

        selectJoint ? this.selectJoint(minIndex) : this.selectBody(minIndex);
        return minIndex;
    }

    //returns the index of the body the mouse is over, -1 if no body is moused over
    getBodyNoMouseIsOver() {
        let minIndex = -1;
        if (this.bodies.length > 0) {
            let min = 100000;
            for (var i = 0; i < this.bodies.length; i++) {
                let pos = this.bodies[i].getPixelCoordinates();
                let distance = dist(mouseX, mouseY, pos.x, pos.y);
                if (distance < min && this.bodies[i].isShiftedPixelPosWithinFixtures(getShiftedMousePos())) {
                    min = distance;
                    minIndex = i;
                }
            }
        }
        return minIndex;
    }


    //returns an Object holding the index of the image the mouse is over as well as the index of the body the image is attached to, -1 if no image is moused over
    getBodyImageNoMouseIsOver() {
        let minBodyIndex = -1;
        let minBodyImageIndex = -1;
        if (this.bodies.length > 0) {
            let min = 100000;
            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = 0; j < this.bodies[i].bodyImages.length; j++) {
                    let bodyImage = this.bodies[i].bodyImages[j];
                    if (bodyImage.mouseIsOverImage()) {
                        let distance = dist(mouseX, mouseY, bodyImage.center.x, bodyImage.center.y);
                        if (distance < min) {
                            min = distance;
                            minBodyIndex = i;
                            minBodyImageIndex = j;
                        }

                    }

                }


            }
        }
        return {bodyNo: minBodyIndex, bodyImageNo: minBodyImageIndex};
    }

    //unselects all the body images from all the bodies+
    unselectAllBodyImages() {
        for (let body of this.bodies) {
            for (let bodyImage of body.bodyImages) {
                bodyImage.selected = false;
                bodyImage.selectedForDelete = false;
            }
        }


    }

    //select the argument body no, this includes setting this.selectedBody and setting the body object to have selected = true
    selectBody(bodyNo) {
        this.selectedBody = bodyNo;
        if (this.selectedBody !== -1) {
            this.bodies[this.selectedBody].selected = true;
        }
    }

    //select the argument joint no, this includes setting this.selectedJoint and setting the joint object to have selected = true
    selectJoint(jointNo) {
        this.selectedJoint = jointNo;
        if (this.selectedJoint !== -1) {
            this.joints[this.selectedJoint].selected = true;
        }
    }

    //select the closest body the mouse is over except any body numbers included in the dontCheck list
    selectBodyMouseIsOverExcluding(...dontCheck) {
        this.unselectEverythingExceptForSelectedAsShape1s();
        this.selectBody(this.getBodyNoMouseIsOverExcluding(...dontCheck));
    }

    //get the body number of the closest body the mouse is over except any body numbers included in the dontCheck list
    getBodyNoMouseIsOverExcluding(...dontCheck) {
        let minIndex = -1;
        if (this.bodies.length > 0) {
            let min = 100000;
            for (var i = 0; i < this.bodies.length; i++) {
                if (dontCheck.contains(i)) {
                    continue;
                }
                let pos = this.bodies[i].getPixelCoordinates();
                let distance = dist(mouseX, mouseY, pos.x, pos.y);
                if (distance < min && this.bodies[i].isShiftedPixelPosWithinFixtures(getShiftedMousePos())) {
                    min = distance;
                    minIndex = i;
                }
            }
        }
        return minIndex;
    }


    //move the selected joint or body to the current mouse position
    //this requires dragMouseFrom and startingBodyPos vectors to be set.
    moveSelectedBodyOrJointToMousePos() {
        //difference between current mouse position and the starting dragging position

        if (this.selectedBody !== -1) {
            let difference = createVector(mouseX - dragMouseFrom.x, mouseY - dragMouseFrom.y);
            let newPosition = createVector(startingBodyPos.x + difference.x, startingBodyPos.y + difference.y);
            this.bodies[this.selectedBody].setPosition(newPosition);
        } else if (this.selectedJoint !== -1) {
            let difference = createVector(mouseX - dragMouseFrom.x, mouseY - dragMouseFrom.y);
            let newPosition = createVector(startingAnchorPos.x + difference.x, startingAnchorPos.y + difference.y);
            this.joints[this.selectedJoint].setPositionOfAnchor(0, newPosition);
        }
    }

    //returns the creature as an object (like JSON)
    getCreatureAsObject() {
        let obj = {bodies: [], joints: []};

        for (let b of this.bodies) {
            obj.bodies.push(b.getBodyInfoAsObject());
        }

        for (let j of this.joints) {

            obj.joints.push(j.getJointInfoAsObject());
        }


        let totalMass = 0;
        for (let b of this.bodies) {
            totalMass += b.body.GetMass();
        }
        //scale the creature down a bit;

        let scaleDownAmount = 0.75;
        if (totalMass < 60) {
            scaleDownAmount = 1;
        }
        for (let b of obj.bodies) {
            b.x *= scaleDownAmount;
            b.y *= scaleDownAmount;
            for (let f of b.fixtures) {
                switch (f.fixtureType) {
                    case "rectangle":
                        f.x *= scaleDownAmount;
                        f.y *= scaleDownAmount;
                        f.w *= scaleDownAmount;
                        f.h *= scaleDownAmount;
                        break;
                    case "circle":
                        f.x *= scaleDownAmount;
                        f.y *= scaleDownAmount;
                        f.radius *= scaleDownAmount;
                        break;
                    case "compound":

                        for (let i = 0; i < f.pixelVectorPositions.length; i++) {
                            f.pixelVectorPositions[i].x *= scaleDownAmount;
                            f.pixelVectorPositions[i].y *= scaleDownAmount;
                        }
                        break;

                }


            }


            for (let bodyImage of b.bodyImages) {
                bodyImage.x *= scaleDownAmount;
                bodyImage.y *= scaleDownAmount;
                bodyImage.w *= scaleDownAmount;
                bodyImage.h *= scaleDownAmount;
            }

        }

        for (let j of obj.joints) {
            j.anchorX *= scaleDownAmount;
            j.anchorY *= scaleDownAmount;
        }


        return obj;
    }


    //returns whether the creature has a screaming image on it
    isScreaming(){
        for(let b of this.bodies){
            for(let bodyImage of b.bodyImages){
                if(bodyImage.isScreaming){
                    return true;
                }
            }
        }

        return false;

    }
}