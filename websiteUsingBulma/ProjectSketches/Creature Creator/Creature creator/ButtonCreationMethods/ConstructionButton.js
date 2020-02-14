//this button returns the player to the default buttons
function generateConstructionButton(x, y, w, h, modeNumber) {

    let buttonText = "Construction";
    let mode = new Mode();

    mode.onActivate = function () {
        buttonManager.deactivateActiveModes();
        buttonManager.activateDefaultButtons();
        if (creature.selectedBodyToEditCosmetically !== -1) {
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = false;

        }

    };
    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}