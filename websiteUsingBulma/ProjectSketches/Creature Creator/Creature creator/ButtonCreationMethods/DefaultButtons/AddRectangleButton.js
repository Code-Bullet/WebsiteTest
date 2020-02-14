//allows the user to add rectangles to the creature
function generateAddRectangleButton(x, y, w, h, modeNumber) {

    let buttonText = "Add Rectangle";
    let mode = new Mode();
    mode.cornerMode = true;

    mode.doneFirstClick = false;
    mode.firstClick = createVector(0, 0);
    mode.lineWidth = 30;

    mode.drawEffects = function () {
        push();
        fill(selectedBodyFillColor);
        stroke(selectedStrokeColor);

        if (this.doneFirstClick) {
            if (this.cornerMode) {
                rectMode(CORNERS);
                rect(this.firstClick.x, this.firstClick.y, mouseX, mouseY);
            } else {

                /*
                assume line looks like this for variable naming purposes

                -------------------------------------------------------
               |                                                        |
               . firstClick                                             .mousePos
               |                                                        |
                -------------------------------------------------------
                 */
                let lengthVector = createVector(mouseX - this.firstClick.x, mouseY - this.firstClick.y);
                let heightVector = createVector().set(lengthVector);
                heightVector.rotate(-PI / 2.0);
                heightVector.normalize();
                heightVector.mult(this.lineWidth / 2.0);

                beginShape();
                vertex(this.firstClick.x + heightVector.x, this.firstClick.y + heightVector.y);
                vertex(this.firstClick.x + heightVector.x + lengthVector.x, this.firstClick.y + heightVector.y + lengthVector.y);
                vertex(this.firstClick.x - heightVector.x + lengthVector.x, this.firstClick.y - heightVector.y + lengthVector.y);
                vertex(this.firstClick.x - heightVector.x, this.firstClick.y - heightVector.y);
                endShape(CLOSE);
            }
        }
        pop();
    };

    //either set the first click or create the rectangle
    mode.onClick = function () {
        if (!this.doneFirstClick) {
            this.doneFirstClick = true;
            this.firstClick = createVector(mouseX, mouseY);
        } else {

            let body = new Body((this.firstClick.x + mouseX) / 2.0, (this.firstClick.y + mouseY) / 2.0, 0, true);

            if (this.cornerMode) {
                let w = abs(mouseX - this.firstClick.x);
                let h = abs(mouseY - this.firstClick.y);
                body.addRectFixture(-w / 2.0, -h / 2.0, w, h, 0);


            } else {
                let arr = [];
                let lengthVector = createVector(mouseX - this.firstClick.x, mouseY - this.firstClick.y);
                let heightVector = createVector().set(lengthVector);
                heightVector.rotate(-PI / 2.0);
                heightVector.normalize();
                heightVector.mult(this.lineWidth / 2.0);
                arr.push(createVector(this.firstClick.x + heightVector.x, this.firstClick.y + heightVector.y));
                arr.push(createVector(this.firstClick.x + heightVector.x + lengthVector.x, this.firstClick.y + heightVector.y + lengthVector.y));
                arr.push(createVector(this.firstClick.x - heightVector.x + lengthVector.x, this.firstClick.y - heightVector.y + lengthVector.y));
                arr.push(createVector(this.firstClick.x - heightVector.x, this.firstClick.y - heightVector.y));

                arr = arr.map((vec) => createVector(vec.x - body.x, vec.y - body.y));
                body.addArrayFixture(arr);

            }
            this.doneFirstClick = false;
            creature.bodies.push(body);
            warning = new Warning("Rectangle Added", 100, true);
        }

    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case SHIFT:
                shiftIncrease = 10;
                break;
            case TAB:
                this.cornerMode = !this.cornerMode;
                break;
            case ESCAPE:
                if (this.doneFirstClick) {
                    this.doneFirstClick = false;
                } else {
                    buttonManager.deactivateActiveModes();
                }
                break;
        }
    };

    //adjusts line width
    mode.scrollWheel = function (mouseDirection) {
        if (!this.cornerMode) {
            this.lineWidth = max(this.lineWidth + (2 * shiftIncrease) * mouseDirection, 3);
        }

    };


    mode.instructions.getMessages = function () {
        let messages = [];
        let currentMode = buttonManager.getCurrentMode();
        currentMode.cornerMode ? messages.push("Corners mode") : messages.push("Line Mode");

        messages.push("CLICK: you figure it out");
        messages.push("TAB: change mode");

        if (!currentMode.cornerMode) {
            messages.push("MOUSE WHEEL: scale width");
            messages.push("HOLD SHIFT: increase scale speed");
        }

        if (!currentMode.doneFirstClick) {
            messages.push("ESC: exit  ");
        } else {
            messages.push("ESC: cancel");
        }
        return messages;
    };
    mode.onActivate = function(){
        this.doneFirstClick =false;
    };
    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}