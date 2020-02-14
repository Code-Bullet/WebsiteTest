function generateChangeFillColorButton(x, y, w, h, modeNumber) {
    let buttonText = "Change Fill Color";
    let mode = new Mode();
    mode.hotBar = new HotBar(200, 70, canvas.width - 400, 60, 7);
    mode.hotBar.addColorButtons();

    //on activation automatically select the bodypart last selected during the previous activation
    mode.onActivate = function () {
        if (creature.selectedBodyToEditCosmetically !== -1)
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = true;

    };
    mode.onDeactivate = function () {
    };

    //if the hotbar has not selected a button then select the body part the mouse is over,
    mode.everyFrame = function () {
        creature.selectBodyMouseIsOverExcluding(creature.selectedBodyToEditCosmetically);

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
        } else {
            if (creature.selectedBodyToEditCosmetically !== -1) {
                let button = this.hotBar.getCurrentlySelectedButton();
                creature.bodies[creature.selectedBodyToEditCosmetically].setFillColorOfAllFixtures(button.color);
            }
            this.hotBar.unclickAllButtons();
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
        messages.push("Change the fill Color of the selected shape");
        messages.push("CLICK: Select Shape To add Images To");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}