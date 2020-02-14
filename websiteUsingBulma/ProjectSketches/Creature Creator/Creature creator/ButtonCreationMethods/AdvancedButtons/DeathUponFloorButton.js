//this button allows the user to set the death upon floor property for certain bodies in the creature, during training if these bodies touch the floor then the player instantly dies
function generateDeathUponFloorButton(x, y, w, h, modeNumber){

    let buttonText = "Death upon floor";
    let mode = new Mode();
    mode.onActivate = function () {

    };

    mode.name = "Death upon floor";

    mode.everyFrame = function () {
        creature.selectBodyMouseIsOverExcluding();
    };

    mode.onDeactivate = function () {

        this.bodies = [];
        creature.unselectAllBodies();

    };
    mode.onClick = function () {

        if (creature.selectedBody !== -1) {
            creature.getSelectedBody().deathIfTouchesGround = !creature.getSelectedBody().deathIfTouchesGround;
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

        messages.push("Select shapes which will kill the player if they touch the ground")
        messages.push("CLICK: toggle ground kill on shape");
        messages.push("ESC: exit ");
        return messages;
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}
