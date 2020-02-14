//this button allows the user to add images to the creature
function generateAddImageToShapeButton(x, y, w, h, modeNumber) {
    let buttonText = "Add Image To Shape";
    let mode = new Mode();
    mode.hotBar = new HotBar(200, 70, canvas.width - 400, 60, 7);
    mode.hotBar.addImageButtons();
    mode.inScaleMode = true;

    //on activation automatically select the bodypart last selected during the previous activation
    mode.onActivate = function () {
        this.hotBar.unclickAllButtons();
        if (creature.selectedBodyToEditCosmetically !== -1)
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = true;


    };
    mode.onDeactivate = function () {
        this.hotBar.unclickAllButtons();
    };

    //if the hotbar has not selected a button then select the body part the mouse is over,
    mode.everyFrame = function () {
        if (!this.hotBar.hasSelectedItem()) {
            creature.selectBodyMouseIsOverExcluding(creature.selectedBodyToEditCosmetically);
        }
    };

    //draws the hotbar
    mode.drawEffects = function () {
        this.hotBar.show();
    };

    //if no hotbar button is selected then select the body the mouse is over as shape 1 and as selecedBodyTOEditCosmetically
    //if a hotbar button is selected and the mouse is not over the hotbar(this prevents the item from being immediately placed) the image is attached to the selected body
    mode.onClick = function () {
        this.hotBar.onClick();

        if (this.hotBar.selectedButton === -1) {
            if (creature.selectedBody === -1) {//if the mouse isnt over a body
                return;
            }

            if (creature.selectedBodyToEditCosmetically !== -1)
                creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = false;

            creature.selectedBodyToEditCosmetically = creature.selectedBody;
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = true;
            creature.bodies[creature.selectedBodyToEditCosmetically].selected = false;
        } else if (!this.hotBar.mouseOverHotBar()) {
            let button = this.hotBar.getCurrentlySelectedButton();
            button.mode.bodyImage.addToBody(creature.bodies[creature.selectedBodyToEditCosmetically]);
            button.onClick();
            this.hotBar.unclickAllButtons();
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case SHIFT:
                shiftIncrease = 10;
                break;
            case TAB:
                this.inScaleMode = !this.inScaleMode;
                break;
            case ESCAPE:
                if (this.hotBar.hasSelectedItem()) {
                    this.hotBar.unclickAllButtons();
                } else {
                    buttonManager.deactivateActiveModes();
                }
                break;
        }
    };


    //when the scroll wheel is moved either scale or rotate the image depending on what state the mode is in
    mode.scrollWheel = function (mouseDirection) {
        if (this.hotBar.selectedButton !== -1) {
            if (this.inScaleMode) {
                this.hotBar.getCurrentlySelectedButton().mode.bodyImage.scale(1 + (0.02 * shiftIncrease) * mouseDirection);

            } else {
                this.hotBar.getCurrentlySelectedButton().mode.bodyImage.rotate(PI / 200 * shiftIncrease * mouseDirection);
            }

        }
    };

    mode.instructions.getMessages = function () {
        let messages = [];

        messages.push("Add Images To Selected Shape");

        messages.push("TAB: Change Mouse Wheel Mode");

        if (buttonManager.getCurrentMode().inScaleMode) {
            messages.push("MOUSE WHEEL: SCALE picture");
            messages.push("HOLD SHIFT: increase scale speed");

        } else {
            messages.push("MOUSE WHEEL: ROTATE picture");
            messages.push("HOLD SHIFT: increase rotation speed");
        }

        if (buttonManager.getCurrentMode().hotBar.hasSelectedItem())
            messages.push("CLICK: add image");
        else
            messages.push("CLICK: Select Shape");




        if (buttonManager.getCurrentMode().hotBar.hasSelectedItem()) {
            messages.push("ESC: cancel");
        } else {
            messages.push("ESC: exit");

        }
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}