//this class holds the logic for displaying an image on an object
class BodyImage {
    constructor(image, x, y, w, h, isScreaming) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.center = createVector(this.x + this.w / 2, this.y + this.h / 2);
        this.angle = 0;

        this.centerRelativeToBody = createVector(0, 0);
        this.angleRelativeToBody = 0;
        this.body;

        this.selected = false;
        this.selectedForDelete = false;

        this.isScreaming = isScreaming;

    }

    //returns the body image as a an object (like JSON)
    getBodyImageAsObject(){
        this.updateGlobalPositionBasedOnBodyAndRelativePositioning();
        let obj = {image: null, x: 0, y: 0, w: 0, h: 0, angle: 0, angleRelativeToBody:0,centerRelativeToBody: 0};

        Object.keys(this).forEach((key) => {
            if (key in obj) {
                obj[key] = this[key];
            }
        });
        return obj;
    }

    //creates a copy of ths body image
    clone(){
        this.updateGlobalPositionBasedOnBodyAndRelativePositioning();
        let clone = new BodyImage(this.image,this.x,this.y,this.w,this.h, this.isScreaming);
        clone.angle = this.angle;
        return clone;
    }

    //adds this image to the body and set the relative positioning of this image
    addToBody(body) {

        this.body = body;
        this.updateRelativePositioningBasedOnBodyAndGlobalPositioning();
        body.addBodyImage(this);
    }

    //uses the global positioning and the position of the body to calculate the relative positioning of the image
    updateRelativePositioningBasedOnBodyAndGlobalPositioning() {

        this.centerRelativeToBody = p5.Vector.sub(this.center, createVector(this.body.x, this.body.y));
        this.centerRelativeToBody.rotate(-this.body.angle);
        this.angleRelativeToBody = this.angle - this.body.angle;
    }

    //uses the relativve positioning and the position of the body to calculate the global positioning of the image
    updateGlobalPositionBasedOnBodyAndRelativePositioning() {
        let temp = createVector(this.centerRelativeToBody.x, this.centerRelativeToBody.y)
        temp.rotate(this.body.angle);
        this.center = p5.Vector.add(temp, createVector(this.body.x, this.body.y));
        this.angle = this.angleRelativeToBody + this.body.angle;
        this.x = this.center.x - this.w / 2;
        this.y = this.center.y - this.h / 2;


    }

    //adds the image to a new body
    addToNewBody(newBody) {
        this.updateGlobalPositionBasedOnBodyAndRelativePositioning();
        this.addToBody(newBody);
    }

    //shows the image
    show() {
        push();
        translate(this.x + this.w / 2, this.y + this.h / 2);
        rotate(this.angle);

        if (this.selected) {
            rectMode(CENTER);
            stroke(255, 255, 0, 100);
            fill(255, 255, 0, 50);
            rect(0, 0, this.w, this.h);
        }
        if (this.selectedForDelete) {
            rectMode(CENTER);
            stroke(255, 0, 0, 100);
            fill(255, 0, 0, 50);
            rect(0, 0, this.w, this.h);
        }
        imageMode(CENTER);
        image(this.image, 0, 0, this.w, this.h);
        pop();
    }

    //displays the image using its relative positioning
    //assumed that the program has already translated to the bodies position
    showRelativeToBody() {
        push();
        translate(this.centerRelativeToBody.x, this.centerRelativeToBody.y);
        rotate(this.angleRelativeToBody);

        if (this.selected) {
            rectMode(CENTER);
            stroke(255, 255, 0, 100);
            fill(255, 255, 0, 50);
            rect(0, 0, this.w, this.h);
        }
        if (this.selectedForDelete) {
            rectMode(CENTER);
            stroke(255, 0, 0, 100);
            fill(255, 0, 0, 50);
            rect(0, 0, this.w, this.h);
        }
        imageMode(CENTER);
        image(this.image, 0, 0, this.w, this.h);
        pop();

    }

    //scales the image
    scale(scaleAmount) {

        this.w *= scaleAmount;
        this.h *= scaleAmount;
        this.x = this.center.x - this.w / 2;
        this.y = this.center.y - this.h / 2;


    }

    //scales the image relative to the body, this means that it position changes as well
    scaleRelativeToBody(scaleAmount) {
        this.centerRelativeToBody.x *= scaleAmount;
        this.centerRelativeToBody.y *= scaleAmount;
        this.w *= scaleAmount;
        this.h *= scaleAmount;
        this.updateGlobalPositionBasedOnBodyAndRelativePositioning();
    }


    //updates the global position of the image
    setPosition(newX, newY) {
        this.center = createVector(newX, newY);
        this.x = this.center.x - this.w / 2;
        this.y = this.center.y - this.h / 2;
        if (this.body)
            this.updateRelativePositioningBasedOnBodyAndGlobalPositioning();

    }

    //rotates the body
    rotate(rotateAmount) {
        this.angle += rotateAmount;

        if (this.body)
            this.updateRelativePositioningBasedOnBodyAndGlobalPositioning();


    }

    //returns whether the mouse is over the iamge
    mouseIsOverImage() {
        if (this.body) {
            //make sure to update the global position just incase the body has moved
            this.updateGlobalPositionBasedOnBodyAndRelativePositioning();

        }


        let mousePosition = createVector(mouseX, mouseY);
        let positionRelativeToCenter = p5.Vector.sub(mousePosition, this.center);
        positionRelativeToCenter.rotate(-this.angle);
        let pos = p5.Vector.add(this.center, positionRelativeToCenter);

        return (pos.x > this.x && pos.x < this.x + this.w && pos.y > this.y && pos.y < this.y + this.h);


    }

    //moves the image to the mouses positiion
    moveToMousePosition() {
        this.setPosition(mouseX - this.w / 2, mouseY - this.h / 2);
    }
}