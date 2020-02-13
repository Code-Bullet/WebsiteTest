var targetImage;
var targetImages = [];
var first = true;
var count = 0;

var dots = [];
var imageNo = 0;
var reachCount = 30;


var checkMousePos = true;
var pause = false;

var targets = [];
var totalDots = 12288;

let frameRateRatio = 1;


let startFromLeft = false;
let finishFromLeft = true;
let superSpeed = false;

let imagehref = [];


let scaleAmount = 10;
function preload() {


    targetImages.push(loadImage("projectSketch/images/flappyBird.png"));
    targetImages.push(loadImage("projectSketch/images/worldsHardestGame.png"));
    targetImages.push(loadImage("projectSketch/images/hillClimbRacing.png"));
    targetImages.push(loadImage("projectSketch/images/chess.png"));
    targetImages.push(loadImage("projectSketch/images/marbleCalculator.png"));

    imagehref.push("ProjectSketches/flappyBird/flappyBird.html");
    imagehref.push("ProjectSketches/WorldsHardestGame/WHGprojects.html");
    imagehref.push("ProjectSketches/Hill%20Climb%20Racing/hillClimbRacing.html");
    imagehref.push("ProjectSketches/chess/chess.html");
    imagehref.push("ProjectSketches/MarbleCalculator/MarbleCalculator.html");

}

let RArrowPositions = [];
let LArrowPositions = [];

function setup() {
    if (windowHeight < 1000) {
        window.canvas = createCanvas(128 * 8, 96 * 8);
        scaleAmount = 8;
    } else {
        window.canvas = createCanvas(1280, 960);
    }
    canvas.parent('canvas');
    frameRate(20);
    // pixelDensity(1);


    RArrowPositions = [];
    let x = 128 - 6;
    let y = 96 / 2 - 3;
    // RArrowPositions.push(createVector(x,y));
    RArrowPositions.push(createVector(x + 1, y));
    RArrowPositions.push(createVector(x + 1, y + 1));
    RArrowPositions.push(createVector(x + 2, y + 1));
    RArrowPositions.push(createVector(x + 2, y + 2));
    RArrowPositions.push(createVector(x + 3, y + 2));
    RArrowPositions.push(createVector(x + 3, y + 3));
    RArrowPositions.push(createVector(x + 4, y + 3));
    RArrowPositions.push(createVector(x + 3, y + 4));
    RArrowPositions.push(createVector(x + 2, y + 4));
    RArrowPositions.push(createVector(x + 2, y + 5));
    RArrowPositions.push(createVector(x + 1, y + 5));
    RArrowPositions.push(createVector(x + 1, y + 6));
    // RArrowPositions.push(createVector(x,y+6));

    //fill it in
    // RArrowPositions.push(createVector(x,y+1));
    // RArrowPositions.push(createVector(x,y+2));
    // RArrowPositions.push(createVector(x,y+3));
    // RArrowPositions.push(createVector(x,y+4));
    // RArrowPositions.push(createVector(x,y+5));
    // RArrowPositions.push(createVector(x,y+6));

    RArrowPositions.push(createVector(x + 1, y + 2));
    RArrowPositions.push(createVector(x + 1, y + 3));
    RArrowPositions.push(createVector(x + 2, y + 3));
    RArrowPositions.push(createVector(x + 1, y + 4));


    LArrowPositions = [];
    x = 5;
    y = 96 / 2 - 3;
    // RArrowPositions.push(createVector(x,y));
    LArrowPositions.push(createVector(x - 1, y));
    LArrowPositions.push(createVector(x - 1, y + 1));
    LArrowPositions.push(createVector(x - 2, y + 1));
    LArrowPositions.push(createVector(x - 2, y + 2));
    LArrowPositions.push(createVector(x - 3, y + 2));
    LArrowPositions.push(createVector(x - 3, y + 3));
    LArrowPositions.push(createVector(x - 4, y + 3));
    LArrowPositions.push(createVector(x - 3, y + 4));
    LArrowPositions.push(createVector(x - 2, y + 4));
    LArrowPositions.push(createVector(x - 2, y + 5));
    LArrowPositions.push(createVector(x - 1, y + 5));
    LArrowPositions.push(createVector(x - 1, y + 6));
    // RArrowPositions.push(createVector(x,y+6));

    //fill it in
    // RArrowPositions.push(createVector(x,y+1));
    // RArrowPositions.push(createVector(x,y+2));
    // RArrowPositions.push(createVector(x,y+3));
    // RArrowPositions.push(createVector(x,y+4));
    // RArrowPositions.push(createVector(x,y+5));
    // RArrowPositions.push(createVector(x,y+6));

    LArrowPositions.push(createVector(x - 1, y + 2));
    LArrowPositions.push(createVector(x - 1, y + 3));
    LArrowPositions.push(createVector(x - 2, y + 3));
    LArrowPositions.push(createVector(x - 1, y + 4));

    for (let i = 0; i < totalDots; i++) {
        dots.push(new Dot());
    }
    setTargetsForNextImage();


    print(windowWidth, windowHeight)
}

function nextImage() {
    imageNo++;
    if (imageNo >= targetImages.length) {
        imageNo = 0;
    }
    setTargetsForNextImage();

}

function previousImage() {
    imageNo--;
    if (imageNo < 0) {
        imageNo = targetImages.length - 1;
    }
    setTargetsForNextImage();

}

function setTargetsForNextImage() {


    targetImages[imageNo].loadPixels();
    let scaleAmount = this.canvas.width / targetImages[imageNo].width;
    this.roundedScale = Math.floor(scaleAmount / 2) * 2;

    let arrowPositions = [...LArrowPositions, ...RArrowPositions];
    for (var y = 0; y < targetImages[imageNo].height; y++) {
        for (var x = 0; x < targetImages[imageNo].width; x++) {
            var index = (x + y * targetImages[imageNo].width) * 4;
            let r = targetImages[imageNo].pixels[index];
            let g = targetImages[imageNo].pixels[index + 1];
            let b = targetImages[imageNo].pixels[index + 2];


            for (let pos of arrowPositions) {
                if (pos.x === x && pos.y === y) {
                    r = min(r + 1000, 255);
                    g = min(g + 1000, 255);
                    b = min(b + 1000, 255);


                    r = 240;
                    g = 240;
                    b = 240;
                    break;
                }
            }

            targets.push({x: x * scaleAmount, y: y * scaleAmount, r: r, g: g, b: b});
        }
    }


    for (let dot of dots) {
        var tempTarget = targets.splice(floor(random(targets.length)), 1)[0];
        dot.setTarget(tempTarget.x, tempTarget.y, tempTarget.r, tempTarget.g, tempTarget.b);
    }


    // if (finishFromLeft)
    dots.sort((a, b) => b.target.x - a.target.x);
    //else
    //  dots.sort((a, b) => a.target.x - b.target.x);


}

let showing;

function draw() {
    if (pause)
        return;
    //check if all the dots have reached their goal
    var allReached = true;
    for (var d of dots) {
        if (!d.reached) {
            allReached = false;
        }
    }


    if (allReached) {//if they have then wait a bit mate (dont show anything)
        drawMesh();
        superSpeed = false;
    } else {//if some dots have yet to reach their destination then show them all


        showing = totalDots;
        if (superSpeed) {
            frameRateRatio = 120 / frameRate();
        } else {
            frameRateRatio = 20 / frameRate();

        }

        //instead Of Drawing Background draw a rectangle to the max unreached x
        //that way instead of having to redraw the dots just redraw the x
        noStroke();
        fill(20);

        let minMovingX = 0;
        let maxMovingX = 1280;

        minMovingX = getMinMovingX();
        maxMovingX = getMaxMovingX();
        push();
        rectMode(CORNERS);
        if (maxMovingX < minMovingX) {

            //draw nothing
        } else {

            rect(minMovingX, 0, maxMovingX + scaleAmount, canvas.height);
        }
        pop();

        drawMesh();

        for (let i = 0; i < dots.length; i++) {
            let dotNo = finishFromLeft ? i : dots.length - 1 - i;

            dots[dotNo].move();
            dots[dotNo].show(minMovingX, maxMovingX);


        }

        stroke(20);
        strokeWeight(2);
        line(canvas.width, 0, canvas.width, canvas.height);


    }

    if (allReached && mouseOverFrame() && mouseX > canvas.width - 7*scaleAmount) {
        if (!onRight) {
            background(60);
            for (let d of dots) {
                d.show(0, 2000);
            }

            noStroke();
            fill(255, 200);
            rect(canvas.width - 7*scaleAmount, 0, 7*scaleAmount, canvas.height);
            drawMesh();

            for (let pos of RArrowPositions) {
                fill(120);
                noStroke();
                rect(pos.x * scaleAmount + 1, pos.y * scaleAmount + 1, scaleAmount - 2, scaleAmount - 2);


            }

        }
        onRight = true;
    } else {
        if (onRight) {
            background(60);
            for (let d of dots) {
                d.show(0, 2000);
            }
        }
        onRight = false;
    }

    if (allReached && mouseOverFrame() && mouseX <  7*scaleAmount) {
        if (!onLeft) {
            background(60);
            for (let d of dots) {
                d.show(0, 2000);
            }

            noStroke();
            fill(255, 200);
            rect(0, 0,  7*scaleAmount, canvas.height);
            drawMesh();

            for (let pos of LArrowPositions) {
                fill(120);
                noStroke();
                rect(pos.x * scaleAmount + 1, pos.y * scaleAmount + 1, scaleAmount - 2, scaleAmount - 2);


            }

        }
        onLeft = true;
    } else {
        if (onLeft) {
            background(60);
            for (let d of dots) {
                d.show(0, 2000);
            }
        }
        onLeft = false;
    }


    // stroke(0);
    // strokeWeight(2);
    // fill(255);
    // text(frameRate().toFixed(2), 10, 10);
    // textSize(20);
    // text(showing, 100, 100);
}

let onRight = false;
let onLeft = false;

function dotsAreWaiting() {
    for (let dot of dots) {
        if (dot.waitCount > 0) {
            return true;
        }
    }
    return false;

}


function drawMesh() {
    stroke(20);
    strokeWeight(2);
    for (let i = 0; i <= canvas.width; i += scaleAmount) {
        line(i, 0, i, canvas.height);
    }
    for (let i = 0; i <= canvas.height; i += scaleAmount) {
        line(0, i, canvas.width, i);
    }
}

function getMaxMovingX() {


    let maxX = 0;

    for (let dot of dots) {
        if (!dot.reached && dot.waitCount <= 0 && maxX < dot.pos.x) {
            maxX = dot.pos.x;
        }
    }

    return maxX + scaleAmount;

}

function getMinMovingX() {

    let minX = 100000;

    for (let dot of dots) {
        if (!dot.reached && dot.waitCount <= 0 && minX > dot.pos.x) {
            minX = dot.pos.x;
        }
    }

    return minX - scaleAmount;

}


function mouseOverFrame() {
    return mouseX > 0 && mouseY > 0 && mouseY < canvas.height && mouseX < canvas.width;

}


function mousePressed() {
    if (mouseOverFrame()) {

        if (mouseX > canvas.width - 7*scaleAmount) {
            moveRight();
            return;
        }

        if (mouseX < 7*scaleAmount) {

            moveLeft();
            return;
        }

        var allReached = true;
        for (var d of dots) {
            if (!d.reached) {
                allReached = false;
            }
        }
        if (!allReached) {
            superSpeed = true;
            return;
        }
        window.location.href = imagehref[imageNo];
    }


}

function moveLeft() {
    var allReached = true;
    for (var d of dots) {
        if (!d.reached) {
            allReached = false;
        }
    }
    if (!allReached) {
        superSpeed = true;
        return;
    }

    startFromLeft = true;
    finishFromLeft = true;
    previousImage();
}

function moveRight() {
    var allReached = true;
    for (var d of dots) {
        if (!d.reached) {
            allReached = false;
        }
    }
    if (!allReached) {
        superSpeed = true;
        return;
    }

    startFromLeft = false;
    finishFromLeft = false;
    nextImage();
}

