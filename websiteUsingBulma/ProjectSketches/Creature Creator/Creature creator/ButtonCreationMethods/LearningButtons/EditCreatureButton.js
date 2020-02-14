//this button returns the program to the creature creator section
function generateEditCreatureButton(x, y, w, h, modeNumber) {

    let buttonText = "Edit Creature";
    let mode = new Mode();

    mode.onActivate = function () {
        world.reset();
        inCreatureCreatorMode = true;
        setDefaultInstructions();
        world.paused = true;
        panX = 0;
        buttonManager.activateDefaultButtons();
        this.deactivate();
        resetAudio();
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}