//this button allows the user to toggle the auto speed up boolean, which will increase the simulation speed in proportion to the number of players which are dead.
function generateSpeedUpWhenPlayersDieToggleButton(x, y, w, h) {
    let toggleButton = new ToggleButton(x, y, w, h, "Speed Up When Players Die", false);

    toggleButton.toggleOn = () => {
        autoSpeedUp = true;
        showDeath = false;
        warning = new Warning("Speed will increase as players die, Death animation removed for better performance", 300, true);

    };

    toggleButton.toggleOff = () => {
        autoSpeedUp = false;
        showDeath = true;
    };

    return toggleButton;
}