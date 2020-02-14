//a warning is a message to the user which will appear at the bottom of the screen for lifespan frames.
class Warning {

    constructor(message, lifespan, isMessage) {
        this.message = message;//if the warning is a message then it will be yellow, otherwise it will be red
        this.lifespan = lifespan;

        if (isMessage) {
            this.isMessage = isMessage;
        } else {
            this.isMessage = false;
        }

    }

    //show the warning and reduce its lifespan
    show() {
        if (this.lifespan > 0) {
            this.lifespan--;
            push();
            textAlign(CENTER, CENTER);
            this.isMessage ? fill(255, 255, 0, 230) : fill(255, 0, 0, 255);

            stroke(0, 200);

            strokeWeight(3);
            textSize(25);

            text(this.message, canvas.width / 2, canvas.height - 50);
            pop();
        }
    }

    //returns whether or not the lifespan is 0
    isFinished() {
        return this.lifespan <= 0;
    }
}

let warningFade = 0;
let maxWarningFade = 100;
let warningFadeSpeed = 20;

//shows the current warning
function showWarning() {
    if (!warning) {
        return;
    }
    //fade the warning out
    if (warning.isFinished()) {
        warningFade = max(0, warningFade - warningFadeSpeed);
        warning.isMessage ? fill(100, 100, 0, warningFade) : fill(100, 0, 0, warningFade);
        noStroke();
        rect(0, canvas.height - 95, canvas.width, 100);
        return;
    }

    //fade the warning in
    warningFade = min(maxWarningFade, warningFade + warningFadeSpeed);
    warning.isMessage ? fill(100, 100, 0, warningFade) : fill(100, 0, 0, warningFade);
    noStroke();
    rect(0, canvas.height - 95, canvas.width, 100);

    warning.show();
}