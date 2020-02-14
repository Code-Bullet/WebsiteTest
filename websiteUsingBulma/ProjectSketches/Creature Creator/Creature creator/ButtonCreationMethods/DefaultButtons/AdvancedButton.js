//activates the advanced buttons
function generateAdvancedButton(x, y, w, h, modeNumber) {
    let buttonText = "Advanced";
    let mode = new Mode();
    mode.onActivate = function () {
        buttonManager.deactivateActiveModes();
        buttonManager.activateAdvancedButtons();
        this.deactivate();
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}