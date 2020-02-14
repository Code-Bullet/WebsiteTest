const SCALE = 30;// ratio between box2d box2dWorld coordinates(in meters) and pixel coordinates, so x meters = Scale*x pixels
let world;//the box2dWorld that the created creature is in.
let creature; //the creature that is be creating.
const maxPointsOnPoly = 10; // after an amount points the polygons get too complicated to be accurately simulated therefore i added a limit



let dragMouseFrom; // a vector used when clicking and dragging shit

let newCircleSize = 30;// the starting size for created circles

let shiftIncrease = 1; //for a lot acts involving the mouse wheel shift can be held to increase speed.

let mouseJoint;//a mouse joint is used to allow the user to drag around and fuck with their creation in creature creator mode

let dragging = false;//a boolean used to tell if the mouse is down

let warning;//the current waring which is displayed at the bottom of the screen. this can be overwritten with a new message from anywhere and it will be shown for its given lifespan

let showJointLimits = true;//a boolean (toggleable by the user) which will allow or stop the joint limit arc from showing as its kinda annoying

let allowBodyCollisions = true;//a boolean (toggleable by the user) which will deactivate collisions between all body object(exept for the floor object)

let buttonManager;//manages all the buttons and mode stuff
let defaultInstructions;//the current set of defaultInstructions that appear on the the top bar of the screen, different modes will overwrite the getMessages() function of the defaultInstructions to tell the user what to do in each mode


//called on startup only
function creatureCreatorSetup() {

    //create the world for the creature
    world = new World();
    world.addFloorToWorld();

    //create the creature
    creature = new Creature();

    window.canvas = createCanvas(1500, 850);
    canvas.parent('canvas');


    canvas.mouseWheel(mouseWheelMoved);
    frameRate(60);


    buttonManager = new ButtonManager();

    setDefaultInstructions();

    mouseJoint = new MouseJoint();

    //prevents the window from moving from the arrow keys or the spacebar
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40, 9].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

}

//called every frame when in creature creator
function creatureCreatorDraw() {

    buttonManager.updateCurrentMode();
    mouseJoint.updateTarget();
    world.update();

    drawBackground();

    creature.show();

    buttonManager.showCurrentModeEffects();
    buttonManager.showActiveButtons();

    showWarning();
    showInstructions();

}

//draws the background color and floor
function drawBackground() {

    let tiledPanX = panX * playerScaleAmount;
    while (tiledPanX < 0) {
        tiledPanX += canvas.width;
    }
    tiledPanX = tiledPanX % canvas.width;

    background(200);


    image(floorTilesImage, tiledPanX, 150+594, canvas.width, canvas.height - 150-594);
    image(floorTilesImage, tiledPanX - canvas.width, 150+594, canvas.width, canvas.height - 150-594);

    image(dangerFloor, tiledPanX, canvas.height - 232, canvas.width + 90, 700 / 4);
    image(dangerFloor, tiledPanX - canvas.width, canvas.height - 232, canvas.width + 90, 700 / 4);
}

//called when a key is pressed while in creature creator mode
function creatureCreatorKeyPressed() {
    switch (key) {
        case ' '://play/pause
            world.togglePause();
            break;
        case 'R'://resets the world
            world.reset();
            break;
    }

    //see if the current mode can use the input
    buttonManager.onKeyPressed();

}


//called when a key is released when in creature creator mode, this is used to turn off shift increase
function creatureCreatorKeyReleased() {
    switch (keyCode) {
        case SHIFT:
            shiftIncrease = 1;
            break;
    }
}

//called whenever the mouse is pressed in creature creator mode
function creatureCreatorMousePressed() {
    dragging = true;

    buttonManager.onClick();

    if (!world.paused) {
        mouseJoint.onClick();
    }
}

//used mostly for dragging rated tasks
function mouseReleased() {
    dragging = false;
    mouseJoint.destroyJoint();
}


//called when the mouse wheel is moved
function mouseWheelMoved(event) {
    mouseDirection = 1;
    if (event.deltaY > 0) {
        mouseDirection = -1;
    }

    //check if the current mode needs the input
    buttonManager.onMouseWheelMove(mouseDirection);

}

//returns the pan offset as a vector
function getPannedOffset() {
    return createVector(panX, panY);
}

//gets the mouse position (in pixels) when the panning offset is taken into account, so a panX of -100 and a mouse posX of 300, means the mouse is really at 400 when shifted with the panning
function getShiftedMousePos() {
    let x = mouseX - getPannedOffset().x;
    let y = mouseY - getPannedOffset().y;
    return createVector(x, y);
}

