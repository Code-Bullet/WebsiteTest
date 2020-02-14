class Button {
    constructor(x, y, w, h, text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;


        //button background colors
        this.inactiveColor = color(40);
        this.hoverColor = color(20);
        this.activeColor = color(0);

        //button text colors
        this.inactiveTextColor = color(255, 255, 0,);
        this.hoverTextColor = color(255, 255, 0);
        this.activeTextColor = color(255, 255, 0);


        this.maxTextSize = 18;
        this.isClicked = false;
        this.textSizeVariable = this.maxTextSize;
    }

    //returns whether or not the mouse is over the button
    mouseOverButton() {
        return (this.x < mouseX && this.x + this.w > mouseX) && (this.y < mouseY && this.y + this.h > mouseY);
    }

    //sets the fill() function based on the state of the button
    setFillColor() {
        switch (true) {
            case this.mouseOverButton():
                fill(this.hoverColor);
                break;
            case this.isClicked:
                fill(this.activeColor);
                break;
            case !this.isClicked:
                fill(this.inactiveColor);
                break;
        }
    }

    //sets the fill() function based on the state of the button
    setTextColor() {
        switch (true) {
            case this.mouseOverButton():
                fill(this.hoverTextColor);
                break;
            case this.isClicked:
                fill(this.activeTextColor);
                break;
            case !this.isClicked:
                fill(this.inactiveTextColor);
                break;
        }
        noStroke();
    }


    //reduces text size to fit the text within the maxzTextWidth
    setTextWidthToBeLessThan(maxTextWidth) {
        //while the text width is greater than the width of the button reduce its size
        let fullText = this.getLongestPossibleText();
        this.textSizeVariable = this.maxTextSize;
        textSize(this.textSizeVariable);
        while (textWidth(fullText) > maxTextWidth) {
            this.textSizeVariable--;
            textSize(this.textSizeVariable);
        }
    }


    //shows the button
    show() {
        push();
        //show background color based on button activity
        this.setFillColor();
        stroke(255, 255, 0);
        strokeWeight(1);
        if (this.isClicked)
            strokeWeight(3);
        rect(this.x, this.y, this.w, this.h, 2);

        //show image
        //image(buttonImage, this.x, this.y, this.w, this.h);

        //show text
        textAlign(LEFT, CENTER);
        this.setTextColor();
        this.setTextWidthToBeLessThan(this.w - 20);

        if (this.textSizeVariable < 12)
            text(this.getText(), this.x + 10, this.y + this.h / 2 - 2);
        else
            text(this.getText(), this.x + 10, this.y + this.h / 2 - 3);
        pop();
    }


    getText() {
        return this.text;
    }

    //some buttons have changing text therefore to stop the text size and position from constantly changing then use the longest possible text to set these values
    getLongestPossibleText() {
        return this.text;
    }

    //overwrite
    onClick() {
    }


}

//a mode button is a button which once pressed enters a mode
//e.g. add circle is a mode
class ModeButton extends Button {
    constructor(x, y, w, h, text, mode, buttonNo) {
        super(x, y, w, h, text);

        this.isClicked = false;
        this.mode = mode;
        mode.button = this;
        mode.modeNumber = buttonNo;
    }


    //if unclicked then deactivate mdoe
    //else active this mode
    onClick() {
        this.isClicked = !this.isClicked;
        if (this.isClicked) {
            world.reset();
            buttonManager.deactivateActiveModes();
            this.mode.activate();
        } else {
            this.mode.deactivate();
        }
    }
}

//mode class has many functions to be overwriten by each mode
class Mode {
    constructor() {
        this.isActive = false;
        this.instructions = new Instruction();

        //called when the mode is first entered
        this.onActivate = function () {
        };

        //called when the mode is deactivated
        this.onDeactivate = function () {
        };

        //called every frame, used for drawing effects of the mode
        this.drawEffects = function () {
        };

        //called every frame
        this.everyFrame = function () {
        };

        //called whenever the user clicks
        this.onClick = function () {
        };

        //called whenever a key is pressed
        this.buttonPressed = function () {
        };

        //called whenever the mouse wheel is moved
        this.scrollWheel = function () {
        };


        this.button = null;
        this.modeNumber = 0;

        //deactivate this mode
        this.deactivate = function () {
            this.isActive = false;
            this.button.isClicked = false;
            buttonManager.modeNo = -1;
            this.onDeactivate();
        };

        //activate this mode
        this.activate = function () {
            this.isActive = true;
            this.button.isClicked = true;
            buttonManager.modeNo = this.modeNumber;
            this.onActivate();
        };

        //shows the instructions for this mode
        this.showInstructions = function () {
            this.instructions.show();
        };

        this.name = "";
    }
}

//a button which allows the user to control a value with - + buttons
class ValueButton extends Button {
    /*
    button design
    |    text   | - | + |

    sizes
    |<textWidth>| h | h |

    */
    constructor(x, y, textWidth, h, text) {

        super(x, y, textWidth + 2 * h, h, text);

        this.textWidth = textWidth;
        this.minusStartX = x + textWidth;
        this.plusStartX = x + textWidth + h;
        this.hoverColor = color(0);

    }


    //overwrites button.show()
    show() {
        push();
        //---------text box
        //show text background box
        fill(this.inactiveColor);
        stroke(255, 255, 0);
        strokeWeight(1);
        rect(this.x, this.y, this.textWidth, this.h, 2);
        //show text
        textAlign(LEFT, CENTER);
        fill(this.inactiveTextColor);
        noStroke();
        this.setTextWidthToBeLessThan(this.textWidth - 20);
        text(this.getText(), this.x + 10, this.y + this.h / 2 - 2);

        //---------Minus Box
        //show minus box
        stroke(255, 255, 0);
        this.mouseOverMinus() ? fill(this.hoverColor) : fill(this.inactiveColor);
        rect(this.minusStartX, this.y, this.h, this.h);
        //show minus text
        noStroke();
        textSize(25);
        this.mouseOverMinus() ? fill(this.hoverTextColor) : fill(this.inactiveTextColor);
        text(`-`, this.minusStartX + 7, this.y + this.h / 2 - 5);

        //--------Plus Box
        //show plus box
        stroke(255, 255, 0);
        this.mouseOverPlus() ? fill(this.hoverColor) : fill(this.inactiveColor);
        rect(this.plusStartX, this.y, this.h, this.h, 0, 2, 2, 0);
        //show minus text
        textSize(25);
        noStroke();
        this.mouseOverPlus() ? fill(this.hoverTextColor) : fill(this.inactiveTextColor);
        text(`+`, this.plusStartX + 8, this.y + this.h / 2 - 5);

        pop();
    }

    //overwrites button super class
    getLongestPossibleText() {
        return this.text + ": 999";
    }

    //overwrites button super class

    getText() {
        return `${this.text}: ${this.getValue()}`;
    }

    mouseOverMinus() {
        return (this.minusStartX < mouseX && this.plusStartX > mouseX) && (this.y < mouseY && this.y + this.h > mouseY);
    }

    mouseOverPlus() {
        return (this.plusStartX < mouseX && this.x + this.w > mouseX) && (this.y < mouseY && this.y + this.h > mouseY);
    }

    //overwrites button super class
    onClick() {
        if (this.mouseOverMinus()) {
            this.decreaseValue();
        } else if (this.mouseOverPlus()) {
            this.increaseValue();
        }
    }

    //overwrite
    getValue() {
        return 0;
    }

    //overwrite
    increaseValue() {
    };

    //overwrite
    decreaseValue() {
    };

}

//a toogle button allows the user to control a boolean value
class ToggleButton extends Button {

    constructor(x, y, w, h, text, isClicked) {
        super(x, y, w, h, text);
        this.isClicked = isClicked;
    }

    //overwrites button super class
    show() {
        push();
        //show background color based on button activity
        this.setFillColor();
        stroke(255, 255, 0);
        strokeWeight(1);
        rect(this.x, this.y, this.w, this.h, 2);

        //show text
        textAlign(LEFT, CENTER);
        this.setTextColor();
        this.setTextWidthToBeLessThan(this.w - this.h - 10);

        if (this.textSizeVariable < 12)
            text(this.getText(), this.x + 10, this.y + this.h / 2 - 2);
        else
            text(this.getText(), this.x + 10, this.y + this.h / 2 - 3);


        //show isClicked square
        this.isClicked ? fill(255, 255, 0) : noFill();
        stroke(255, 255, 0);

        let padding = this.h / 4;
        rect(this.x + this.w - this.h + padding, this.y + padding, this.h - 2 * padding, this.h - 2 * padding);


        pop();
    }


    //overwrites button super class
    getValue() {
        return this.isClicked;
    }

    //overwrite
    toggleOn() {
    };

    //overwrite
    toggleOff() {
    };

    //overwrites button super class
    onClick() {
        if (this.mouseOverButton()) {
            this.isClicked ? this.toggleOff() : this.toggleOn();
            this.isClicked = !this.isClicked;
        }
    }
}

