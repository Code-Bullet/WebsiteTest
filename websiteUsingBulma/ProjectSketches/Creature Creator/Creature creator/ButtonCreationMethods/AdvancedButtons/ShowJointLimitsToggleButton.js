//toggles the show joint limits boolean
function generateShowJointLimitsToggleButton(x, y, w, h){
    let toggleButton =  new ToggleButton(x, y, w, h, "Show Joint Limits", true);

    toggleButton.toggleOn = () => {
        showJointLimits = true;
    };

    toggleButton.toggleOff = () => {
        showJointLimits = false;
    };

    return toggleButton;
}