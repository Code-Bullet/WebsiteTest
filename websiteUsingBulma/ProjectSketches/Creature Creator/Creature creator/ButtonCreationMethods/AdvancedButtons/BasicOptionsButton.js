//returns to the default buttons
function generateBasicOptionsButton(x, y, w, h, modeNumber){
    let buttonText = "Basic Options";
    let mode = new Mode();
    mode.onActivate = function () {
        buttonManager.deactivateActiveModes();
        buttonManager.activateDefaultButtons();
        this.deactivate();
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}
