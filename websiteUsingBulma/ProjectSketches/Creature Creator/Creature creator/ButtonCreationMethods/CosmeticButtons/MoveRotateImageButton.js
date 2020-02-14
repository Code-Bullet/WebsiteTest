//this button lets the user move and rotate iamges
function generateMoveRotateImageButton(x, y, w, h, modeNumber) {
    let buttonText = "Move/Rotate Image";
    let mode = new Mode();
    mode.selectedBody = -1;
    mode.selectedBodyImage = -1;

    //on activation automatically select the body part last selected during the previous activation
    mode.onActivate = function () {
        if (creature.selectedBodyToEditCosmetically !== -1)
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = false;


    };

    //when deactivated unselect the current image
    mode.onDeactivate = function () {
        this.selectedBodyImage = -1;
        this.selectedBody = -1;
    };

    //if currently dragging and an image is selected then set the new position of the image
    //else select images the mouse is over
    mode.everyFrame = function () {
        if (dragging && this.selectedBodyImage !== -1) {
            let difference = createVector(mouseX - dragMouseFrom.x, mouseY - dragMouseFrom.y);
            let newPosition = createVector(startingBodyPos.x + difference.x, startingBodyPos.y + difference.y);
            creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].setPosition(newPosition.x,newPosition.y);
        } else {
            creature.unselectAllBodyImages();
            let obj = creature.getBodyImageNoMouseIsOver();
            if (obj.bodyNo !== -1) {
                this.selectedBody = obj.bodyNo;
                this.selectedBodyImage = obj.bodyImageNo;
                creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].selected = true;
            }

        }

    };

    //when the mouse is clicked start dragging if an image is selected
    mode.onClick = function () {
        if (this.selectedBodyImage !== -1) {
            dragMouseFrom = createVector(mouseX, mouseY);
            creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].updateGlobalPositionBasedOnBodyAndRelativePositioning();
            window.startingBodyPos = creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].center;
        }
    };


    mode.buttonPressed = function () {
        switch (keyCode) {
            case SHIFT:
                shiftIncrease = 10;
                break;

            case ESCAPE:

                buttonManager.deactivateActiveModes();

                break;
        }
    };


    //when the scroll wheel is moved rotate the image which is currently selected
    mode.scrollWheel = function (mouseDirection) {
        if (this.selectedBodyImage !== -1) {
            creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].rotate(PI / 200 * shiftIncrease * mouseDirection);
        }
    };

    mode.instructions.getMessages = function () {
        let messages = [];

        messages.push("Move And Rotate Images");
        messages.push("CLICK AND DRAG: move image");
        messages.push("MOUSE WHEEL: rotate image");
        messages.push("HOLD SHIFT: increase rotation speed");
        messages.push("ESC: exit ");

        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}