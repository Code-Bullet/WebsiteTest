// adds a polygon to the creature
function generateAddPolygonButton(x, y, w, h, modeNumber) {
    let buttonText = "Add Polygon";
    let mode = new Mode();

    mode.polygonPositions = [];

    //draws the current lines of the polygon
    mode.drawEffects = function () {
        push();
        strokeWeight(2);
        stroke(0, 0, 0);
        for (var i = 0; i < this.polygonPositions.length - 1; i++) {
            line(this.polygonPositions[i].x, this.polygonPositions[i].y, this.polygonPositions[i + 1].x, this.polygonPositions[i + 1].y);
        }
        if (this.polygonPositions.length > 0) {
            line(this.polygonPositions[this.polygonPositions.length - 1].x, this.polygonPositions[this.polygonPositions.length - 1].y, mouseX, mouseY);
        }
        pop();
    };


    mode.onDeactivate = function () {
        this.polygonPositions = [];

    };

    //adds a point to the polygon, if the user clicks on the starting position and the shape has more than 2 points add the polygon to the world
    mode.onClick = function () {
        if (this.polygonPositions.length > 2 && dist(this.polygonPositions[0].x, this.polygonPositions[0].y, mouseX, mouseY) < 10) {
            this.createPolygonShape();
            return;
        }

        if (this.polygonPositions.length < maxPointsOnPoly) {
            this.polygonPositions.push(getShiftedMousePos());
            if (this.finalLineCrosses(this.polygonPositions)) {
                this.polygonPositions.pop();
                warning = new Warning("Error: Polygons cannot have lines which cross over", 200);
            }
        } else {
            warning = new Warning("Error: Shit hits the fan if the polygons have too many sides, so I made the limit " + maxPointsOnPoly + " points", 200);
        }
    };


    mode.buttonPressed = function () {
        switch (keyCode) {
            case ENTER://closes the shape and adds the polygon
                this.createPolygonShape();

                break;
            case ESCAPE:
                if (this.polygonPositions.length > 0) {
                    this.polygonPositions.splice(this.polygonPositions.length - 1, 1);
                } else {
                    buttonManager.deactivateActiveModes();
                }
                break;
        }
    };


    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Add Polygon");
        messages.push("CLICK: add vertex to polygon");
        messages.push("ENTER: finish polygon");
        if (buttonManager.getCurrentMode().polygonPositions.length === 0) {
            messages.push("ESC: cancel");
        } else {
            messages.push("ESC: remove last vertex");
        }

        return messages;
    };

    //closes the shape and adds it to the creature
    mode.createPolygonShape = function () {
        if (this.polygonPositions.length > 2) {//polygons need atleast 3 points
            this.polygonPositions.push(cloneVector(this.polygonPositions[0]));
            //if the lines cross then error
            if (this.finalLineCrosses(this.polygonPositions, true)) {
                this.polygonPositions.pop();
                warning = new Warning("Error: Closing the shape would introduce crossed lines", 200);
                return;
            }
            this.polygonPositions.pop();

            let x = 0;
            let y = 0;
            for (var v of this.polygonPositions) {
                x += v.x;
                y += v.y;
            }
            x /= this.polygonPositions.length;
            y /= this.polygonPositions.length;

            let body = new Body(x, y, 0, true);
            for (var p of this.polygonPositions) {
                p.x -= x;
                p.y -= y;
            }
            body.addArrayFixture(this.polygonPositions);
            creature.addBody(body);
            this.polygonPositions = [];
            buttonManager.getCurrentMode().deactivate();
            warning = new Warning("Polygon Added", 100, true);

        }


    };

    //determines whether or not the final line of the polygon crosses
    mode.finalLineCrosses = function (vectors, ignoreFirst) {
        let newVecs = [];
        for (var v of vectors) {
            newVecs.push(v);
        }
        let j = newVecs.length - 2;
        for (var i = 0; i < newVecs.length - 3; i++) {
            if (i === 0 && ignoreFirst) {
                continue;
            }
            if (this.linesCross(newVecs[i].x, newVecs[i].y, newVecs[i + 1].x, newVecs[i + 1].y, newVecs[j].x, newVecs[j].y, newVecs[j + 1].x, newVecs[j + 1].y)) {
                return true;
            }
        }

        return false;
    };


    mode.linesCross = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}