//this button lets the user remove images
function generateDeleteImageButton(x, y, w, h, modeNumber) {
    let buttonText = "Delete Image";
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

        creature.unselectAllBodyImages();
        let obj = creature.getBodyImageNoMouseIsOver();
        if (obj.bodyNo !== -1) {
            this.selectedBody = obj.bodyNo;
            this.selectedBodyImage = obj.bodyImageNo;
            creature.bodies[this.selectedBody].bodyImages[this.selectedBodyImage].selectedForDelete = true;
        }

    };

    //when the mouse is clicked start dragging if an image is selected
    mode.onClick = function () {
        if (this.selectedBodyImage !== -1) {
            creature.bodies[this.selectedBody].bodyImages.splice(this.selectedBodyImage, 1);
            warning = new Warning("Image Deleted", 100, true);
            this.selectedBodyImage = -1;
            this.selectedBody = -1;
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case ESCAPE:
                buttonManager.deactivateActiveModes();
                break;
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Delete Images");
        messages.push("CLICK: delete image");
        messages.push("ESC: exit ");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}