//this button toggles the allow body collisions boolean
function generateAllowBodyCollisionsToggleButton(x, y, w, h){
    let toggleButton = new ToggleButton(x, y, w, h, "Allow Body Collisions", true);

    toggleButton.toggleOn = () => {
        allowBodyCollisions = true;
        world.resetBodyCollisions();
    };

    toggleButton.toggleOff = () => {
        allowBodyCollisions = false;
        world.resetBodyCollisions();
    };

    return toggleButton;
}