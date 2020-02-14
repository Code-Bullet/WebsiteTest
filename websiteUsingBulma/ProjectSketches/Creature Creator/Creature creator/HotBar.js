//a hotbar contains a list of buttons and displays them on a scrolling hotbar
class HotBar {
    constructor(x, y, w, h, padding) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.padding = padding;
        this.buttons = [];
        this.numberOfButtons = 12;
        this.currentButtonPosition = 0; // a pointer to the leftmost button, so by default this is 0 so the first button in the array
        this.buttonWidth = h - 2 * padding;
        this.buttonHeight = h - 2 * padding;
        this.gapBetweenButtons = (this.w - (this.numberOfButtons + 2) * (this.buttonWidth + (padding * 2))) / (this.numberOfButtons + 1);

        this.modeNo = -1;
        //create the left arrow button
        this.leftArrow = new Button(x + padding, y + padding, this.buttonWidth, this.buttonHeight);
        this.leftArrow.show = function (isFaded) {
            push();
            this.mouseOverButton() ? fill(255, 247, 0) : fill(255, 247, 0, 100);
            if (isFaded) fill(255, 247, 0, 100);
            noStroke();

            beginShape();
            vertex(this.x + this.w, this.y);
            vertex(this.x, this.y + this.w / 2.0);
            vertex(this.x + this.w, this.y + this.h);
            endShape(CLOSE);
            pop();

        };
        //create the right arrow button
        this.rightArrow = new Button(x + w - h + padding, y + padding, this.buttonWidth, this.buttonHeight);
        this.rightArrow.show = function (isFaded) {
            push();

            this.mouseOverButton() ? fill(255, 247, 0) : fill(255, 247, 0, 100);
            if (isFaded) fill(255, 247, 0, 100);
            noStroke();

            beginShape();
            vertex(this.x, this.y);
            vertex(this.x, this.y + this.h);
            vertex(this.x + this.w, this.y + this.w / 2.0);
            endShape(CLOSE);
            pop();

        };


        this.conveyerBeltSectionImage = loadImage("pics/ConveryerBeltSection.png");

        this.amountToMove = 0;
        this.moveSpeed = 10;

        this.selectedButton = -1;

        this.holdCount = 0;//a counter for telling how long the mouse has held down left/right arrow button

    }

    //returns whether an item is selected
    hasSelectedItem() {
        return this.selectedButton !== -1;
    }

    //returns the currently selected button
    getCurrentlySelectedButton() {

        if (this.selectedButton === -1)
            return null;
        return this.buttons[this.selectedButton];
    }

    mouseOverHotBar() {
        return (this.x < mouseX && this.x + this.w > mouseX) && (this.y < mouseY && this.y + this.h > mouseY);
    }

    //this function is a fucking mess but it works
    getButtonPosition(buttonNo) {
        let obj = {};
        obj.x = this.x + this.buttonWidth + this.padding + this.padding + this.gapBetweenButtons + this.padding + (buttonNo) * (2 * this.padding + this.gapBetweenButtons + this.buttonWidth);//+1 to button number to account for left arrow
        obj.y = this.y + this.padding;
        obj.w = this.buttonWidth;
        obj.h = this.buttonHeight;
        return obj;

    }

    //adds all the image buttons and loads the images from file
    addImageButtons() {
        this.addImageButton(loadImage("Creature creator/CosmeticImages/CBHead.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 1.png"), true);
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 2.png"), true);
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 3.png"), true);
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 4.png"), true);
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 5.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 6.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 7.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 8.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 9.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/face 10.png"));


        this.addImageButton(loadImage("Creature creator/CosmeticImages/eyes1.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/R eye 1.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/L eye 1.png"));

        this.addImageButton(loadImage("Creature creator/CosmeticImages/mouth1.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/mouth 1.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/mouth 2.png"), true);
        this.addImageButton(loadImage("Creature creator/CosmeticImages/mustache 1.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/mustache 2.png"));
        this.addImageButton(loadImage("Creature creator/CosmeticImages/Hat 1.png"));


    }


    //adds the color buttons from the common colors array and a few hand picked ones
    addColorButtons() {
        this.addColorButton(0, 0, 0);       //black

        this.addColorButton(105, 105, 105);
        this.addColorButton(128, 128, 128);
        this.addColorButton(169, 169, 169);
        this.addColorButton(192, 192, 192);
        this.addColorButton(211, 211, 211);
        this.addColorButton(220, 220, 220);
        this.addColorButton(245, 245, 245);

        this.addColorButton(255, 255, 255); //white


        this.addColorButton(255, 0, 0);     //red
        this.addColorButton(255, 69, 0);
        this.addColorButton(255, 99, 71);
        this.addColorButton(250, 128, 114);
        this.addColorButton(255, 140, 0);
        this.addColorButton(255, 165, 0);
        this.addColorButton(255, 215, 0);


        this.addColorButton(0, 255, 0);     //Green
        this.addColorButton(127, 255, 0);
        this.addColorButton(173, 255, 47);
        this.addColorButton(152, 251, 152);
        this.addColorButton(50, 205, 50);
        this.addColorButton(0, 255, 127);

        this.addColorButton(0, 0, 255);     //Blue
        this.addColorButton(65, 105, 225);
        this.addColorButton(135, 206, 250);
        this.addColorButton(0, 191, 255);
        this.addColorButton(127, 255, 212);


        this.addColorButton(255, 219, 172);     //Skin


        //add like 200 other colors
        for (let i = 0; i < commonColors.length; i++) {
            this.addColorButton(commonColors[i][0], commonColors[i][1], commonColors[i][2]);
        }
    }


    //creates an image button from the input image and adds it to the buttons array
    addImageButton(image, isScreaming) {
        let mode = new Mode();
        let buttonPositions = this.getButtonPosition(this.buttons.length);
        let newButton = new hotBarButton(buttonPositions.x, buttonPositions.y, buttonPositions.w, buttonPositions.h, image, mode, this.buttons.length, this.x, this.x + this.w, isScreaming);
        this.buttons.push(newButton);
    }

    //adds a color button to the buttons array
    addColorButton(red, green, blue, opacity) {
        if (!opacity)
            opacity = 255;


        red = Math.min(255, red + 50);
        green = Math.min(255, green + 50);
        blue = Math.min(255, blue + 50);

        let mode = new Mode();
        let buttonPositions = this.getButtonPosition(this.buttons.length);
        let tempColor = color(red, green, blue, opacity);
        let newButton = new colorHotBarButton(buttonPositions.x, buttonPositions.y, buttonPositions.w, buttonPositions.h, tempColor, mode, this.buttons.length, this.x, this.x + this.w);
        this.buttons.push(newButton);

    }

    //shows the hotbar
    show() {


        push();
        //if the arrow buttons are held down then move it
        if (dragging && (this.leftArrow.mouseOverButton() || this.rightArrow.mouseOverButton())) {
            if (this.holdCount < 20) {
                this.holdCount++;
            } else {
                this.moveSpeed = 20;
                if (Math.abs(this.amountToMove) < this.moveSpeed) {
                    this.onClick();
                }
            }
        } else {
            this.holdCount = 0;
        }
        this.moveAllButtons();
        this.moveSpeed = 10;


        //show the background
        fill(100);
        noStroke();
        rectMode(CORNER);
        rect(this.x, this.y, this.w, this.h);
        let numberOfconveyerBeltSections = Math.floor(this.w / this.conveyerBeltSectionImage.width);
        let conveyerBeltSectionWidth = this.w / numberOfconveyerBeltSections;
        for (let i = 0; i < numberOfconveyerBeltSections; i += 1) {
            image(this.conveyerBeltSectionImage, this.x + i * conveyerBeltSectionWidth, this.y, conveyerBeltSectionWidth, this.h);
        }

        //show the currently showing buttons
        for (let button of this.getCurrentlyShowingButtons()) {
            button.show();
        }


        //show some of the backgound to cover up buttons which are under the left and right arrows
        image(this.conveyerBeltSectionImage, this.x + 0 * conveyerBeltSectionWidth, this.y, conveyerBeltSectionWidth, this.h);
        image(this.conveyerBeltSectionImage, this.x + (numberOfconveyerBeltSections - 1) * conveyerBeltSectionWidth, this.y, conveyerBeltSectionWidth, this.h);

        //show the arrow buttons
        this.rightArrow.show(this.currentButtonPosition >= this.buttons.length - this.numberOfButtons);
        this.leftArrow.show(this.currentButtonPosition === 0);

        //draw the mode effects if a button is clicked
        for (let button of this.getCurrentlyShowingButtons()) {
            if (button.isClicked) {
                button.mode.drawEffects();
                break;
            }
        }


        pop();
    }


    //moves all the buttons movespeed pixels if neeeded
    moveAllButtons(direction) {
        if (this.amountToMove === 0) return;

        let amountToMoveThisFrame = (this.amountToMove < 0) ? -1 * this.moveSpeed : this.moveSpeed;
        if (Math.abs(this.amountToMove) < this.moveSpeed) amountToMoveThisFrame = this.amountToMove;
        this.amountToMove -= amountToMoveThisFrame;

        for (let button of this.buttons) {
            button.x += amountToMoveThisFrame;
        }
    }


    //returns all the buttons currently visible on the hotbar
    getCurrentlyShowingButtons() {
        return this.buttons.filter((b, index) => index >= this.currentButtonPosition - 1 && index < this.currentButtonPosition + 1 + this.numberOfButtons);
    }


    onClick() {
        //click the left arrow
        if (this.leftArrow.mouseOverButton()) {

            this.unclickAllButtons();

            //move all buttons
            if (this.currentButtonPosition !== 0) {
                this.currentButtonPosition--;
                this.amountToMove += 2 * this.padding + this.gapBetweenButtons + this.buttonWidth;

            }
            return;

        }
        //click the right button
        if (this.rightArrow.mouseOverButton()) {
            this.unclickAllButtons();
            //move all buttons
            if (this.currentButtonPosition < this.buttons.length - this.numberOfButtons) {
                this.currentButtonPosition++;
                this.amountToMove -= 2 * this.padding + this.gapBetweenButtons + this.buttonWidth;

            }
            return;
        }

        //if any buttons are clicked then unclick all other buttons and click that button
        for (let button of this.getCurrentlyShowingButtons()) {
            if (button.mouseOverButton()) {
                //unclick all other buttons
                let temp = button.isClicked;
                this.unclickAllButtons();
                button.isClicked = temp;
                button.onClick();

                if (button.isClicked)
                    this.selectedButton = button.mode.modeNumber;
                return;// if a button is clicked then leave
            }
        }

        //if user clicked on hot bar (but not on any buttons) then unclick all buttons
        if (this.mouseOverHotBar()) {
            this.unclickAllButtons();
        }

    }

    //unclicks all the buttons on the hotbar
    unclickAllButtons() {
        for (let button of this.buttons) {
            button.isClicked = false;
        }

        this.selectedButton = -1;
    }


}

//a button on the hotbar
//this is for image buttons
class hotBarButton extends ModeButton {
    constructor(x, y, w, h, buttonImage, mode, modeNumber, leftMostPoint, rightMostPoint, isScreaming) {
        super(x, y, w, h, "", mode, modeNumber);
        this.image = buttonImage;
        this.mode.bodyImage = new BodyImage(buttonImage, 0, 0, 50, 50, isScreaming);
        //draw the image at the mouse position as the user is placing the image
        this.mode.drawEffects = function () {
            this.bodyImage.moveToMousePosition();
            this.bodyImage.show();
        };

        //the left and rightmost point are used to not show buttons which are off the hotbar
        this.leftMostPoint = leftMostPoint;
        this.rightMostPoint = rightMostPoint;

        this.isScreaming = isScreaming;

    }

    //show the button
    show() {
        if (this.x + this.w > this.rightMostPoint || this.x < this.leftMostPoint) return;

        push();

        let fillOpacity = this.getOpacity();
        fill(100, fillOpacity);
        stroke(255, fillOpacity);


        if (this.isClicked) fill(180, fillOpacity);
        if (this.mouseOverButton()) fill(150, fillOpacity);
        rect(this.x, this.y, this.w, this.h);


        image(this.image, this.x, this.y, this.w, this.h);
        pop();
    }

    //get the opacity based on how far it is from the edges, this will fade it out
    getOpacity() {
        let fillOpacity = 255;
        let smallestDistanceToEdge = Math.min(this.x - this.leftMostPoint, this.rightMostPoint - (this.x + this.w));
        if (smallestDistanceToEdge < 70) {
            fillOpacity = map(smallestDistanceToEdge, 70, 20, 200, 0);
        }

        return fillOpacity;

    }

    //overwrites button super class
    onClick() {

        this.isClicked = !this.isClicked;
        this.mode.bodyImage = new BodyImage(this.image, 0, 0, 50, 50, this.isScreaming);

    }
}

//a button on the hotbar
//this is for color buttons
class colorHotBarButton extends ModeButton {
    constructor(x, y, w, h, color, mode, modeNumber, leftMostPoint, rightMostPoint) {
        super(x, y, w, h, "", mode, modeNumber);
        this.color = color;
        this.leftMostPoint = leftMostPoint;
        this.rightMostPoint = rightMostPoint;
    }

    //shows the color button
    show() {
        if (this.x + this.w > this.rightMostPoint || this.x < this.leftMostPoint) return;
        push();
        stroke(0);
        if (this.mouseOverButton())
            stroke(230);
        strokeWeight(4);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        pop();
    }

    //overwrites the buttons implementation
    onClick() {
        this.isClicked = !this.isClicked;
    }
}
