class HamiltonianCycle {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.createCycle();
    }


    createCycle() {
        this.createSpanningTree();


        let cycle = [];
        let cycleNodes = [];
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                cycleNodes.push(new HNode(i, j));
            }
        }
        for (let n of cycleNodes) {
            n.setEdges(cycleNodes);
        }
        for (let i = 0; i < this.spanningTreeNodes.length; i++) {

            let currentSpanningTreeNode = this.spanningTreeNodes[i];

            for (let other of currentSpanningTreeNode.spanningTreeAdjacentNodes) {
                let connectNodes = (x1, y1, x2, y2) => {
                    print(x1, y1, x2, y2);
                    if (y1 + this.h * (x1) >= cycleNodes.length || y2 + this.h * (x2) >= cycleNodes.length) {
                        return;
                    }
                    let a = cycleNodes[y1 + this.h * (x1)];
                    let b = cycleNodes[y2 + this.h * (x2)];
                    a.spanningTreeAdjacentNodes.push(b);
                    b.spanningTreeAdjacentNodes.push(a);
                };

                let direction = currentSpanningTreeNode.getDirectionTo(other);
                let x = currentSpanningTreeNode.x * 2;
                let y = currentSpanningTreeNode.y * 2;

                if (direction.x === 1) {
                    //is to the right
                    //CONNECT THEM
                    /*
                     *    *----*    *
                        a         b
                     *    *----*    *

                     */
                    connectNodes(x + 1, y, x + 2, y);
                    connectNodes(x + 1, y + 1, x + 2, y + 1);
                } else if (direction.y === 1) {
                    connectNodes(x, y + 1, x, y + 2);
                    connectNodes(x + 1, y + 1, x + 1, y + 2);
                }
            }
        }

        //make a list of all the nodes which only have 1 adjacent node
        //then make a list of all the edges we need to add
        let degree1Nodes = cycleNodes.filter((n) => n.spanningTreeAdjacentNodes.length === 1);
        let newEdges = [];
        for (let n of degree1Nodes) {
            //get the direction from the other node to this one
            let d = n.spanningTreeAdjacentNodes[0].getDirectionTo(n);
            //add that direction again to get the next node
            d.x += n.x;
            d.y += n.y;
            print(d, n, d.y + this.h * d.x, cycleNodes[d.y + this.h * d.x]);
            //d now points to the new node
            let newEdge = new HEdge(cycleNodes[d.y + this.h * d.x], n);
            let uniqueEdge = true;
            for (let e of newEdges) {
                if (e.isEqualTo(newEdge)) {
                    uniqueEdge = false;
                    break;
                }
            }

            if (uniqueEdge) {
                newEdges.push(newEdge);

            }
        }

        for (let e of newEdges) {
            print(e);
            e.connectNodes();
        }

        //do it again to get the end nodes
        degree1Nodes = cycleNodes.filter((n) => n.spanningTreeAdjacentNodes.length === 1);
        newEdges = [];
        for (let n of degree1Nodes) {
            //
            // let d = n.spanningTreeAdjacentNodes[0].getDirectionTo(n);
            //
            //
            //add that direction again to get the next node
            let d = {x: n.x, y: n.y};
            for (let m of degree1Nodes) {
                if (dist(n.x, n.y, m.x, m.y) === 1) {
                    if (floor(n.x / 2) === floor(m.x / 2) && floor(n.y / 2) === floor(m.y / 2)) {
                        let newEdge = new HEdge(m, n);
                        let uniqueEdge = true;
                        for (let e of newEdges) {
                            if (e.isEqualTo(newEdge)) {
                                uniqueEdge = false;
                                break;
                            }
                        }
                        if (uniqueEdge) {
                            newEdges.push(newEdge);
                        }

                        break;


                    }
                }
            }
        }

        for (let e of newEdges) {
            e.connectNodes();
        }


        print(cycleNodes);
        for (let n of cycleNodes) {
            if (n.spanningTreeAdjacentNodes.length !== 2) {
                print("oof", n);
            }
        }

        cycle = [cycleNodes.getRandomElement()];

        let previous = cycle[0];
        let node = cycle[0].spanningTreeAdjacentNodes[0];

        while (node !== cycle[0]) {

            let next = node.spanningTreeAdjacentNodes[0];
            if (next === previous) {
                next = node.spanningTreeAdjacentNodes[1];
            }

            if (next.spanningTreeAdjacentNodes.length !== 2) {
                print("oof", next);
            }
            cycle.push(node);
            previous = node;
            node = next;
        }

        print(cycle);
        this.cycle = cycle;
        for(let i = 0 ; i<this.cycle.length;i++){
            this.cycle[i].cycleNo = i;
        }


        //start from a random node and move in a random direction
        // let startingNode = this.spanningTree.getRandomElement().node1;
        // cycle.push(startingNode);
        // cycle.push(startingNode.spanningTreeAdjacentNodes[0]);
        // let currentNode = cycle[1];
        // let nextNode = currentNode.getNextNodeMovingLeft(startingNode);
        // while (nextNode !== startingNode || cycle.length !== this.w * this.h) {
        //     cycle.push(nextNode);
        //     nextNode = nextNode.getNextNodeMovingLeft(cycle[cycle.length - 2]);
        //     if (nextNode === cycle[cycle.length - 2]) {
        //         cycle.push(cycle[cycle.length - 1]);
        //     }
        // }
        //
        // print(cycle);
    }

    show() {

        // if(frameCount>100){
        for (let i = 0; i < this.cycle.length; i++) {
            push();
            translate(blockSize / 2, blockSize / 2);
            scale(blockSize);
            fill(255);
            // ellipse(this.cycle[i].x,this.cycle[i].y,0.2);
            textAlign(CENTER, CENTER);
            textSize(0.3);
            text(i, this.cycle[i].x, this.cycle[i].y);
            stroke(255, 100);
            strokeWeight(0.1);
            if (i !== this.cycle.length - 1) {
                line(this.cycle[i].x, this.cycle[i].y, this.cycle[i + 1].x, this.cycle[i + 1].y);
            } else {
                line(this.cycle[i].x, this.cycle[i].y, this.cycle[0].x, this.cycle[0].y);
            }
            pop();
        }
        // }
        // for(let e of this.spanningTree){
        //     push();
        //     translate(blockSize,blockSize);
        //     scale(blockSize*2);
        //     fill(255);
        //     stroke(255,0,0);
        //     strokeWeight(0.1);
        //     line(e.node1.x,e.node1.y,e.node2.x,e.node2.y);
        //     pop();
        //
        //
        // }
    }


    createSpanningTree() {
        let stNodes = [];
        for (var i = 0; i < this.w / 2; i++) {
            for (var j = 0; j < this.h / 2; j++) {
                stNodes.push(new HNode(i, j));
            }
        }

        for (var n of stNodes) {
            n.setEdges(stNodes);
        }

        let spanningTree = [];
        let randomNode = stNodes[floor(random(stNodes.length))];
        spanningTree.push(new HEdge(randomNode, randomNode.edges[0]));
        let nodesInSpanningTree = [randomNode, randomNode.edges[0]];

        while (nodesInSpanningTree.length < stNodes.length) {
            randomNode = nodesInSpanningTree.getRandomElement();
            let edges = randomNode.edges.filter((n) => !nodesInSpanningTree.includes(n));
            if (edges.length !== 0) {
                let randomEdge = edges.getRandomElement();
                nodesInSpanningTree.push(randomEdge);
                spanningTree.push(new HEdge(randomNode, randomEdge));
            }
        }


        for (let n of stNodes) {
            n.setSpanningTreeEdges(spanningTree);
        }
        //spanning tree created
        for (let n of stNodes) {
            if (!nodesInSpanningTree.includes(n)) {
                print("noooooo");
            }
        }


        this.spanningTree = spanningTree;
        print(spanningTree);
        this.spanningTreeNodes = stNodes;
    }

    getNextPosition(x, y) {
        for (let i = 0; i < this.cycle.length; i++) {
            if (this.cycle[i].x === x && this.cycle[i].y === y) {
                return this.cycle[(i + 1) % this.cycle.length];
            }
        }
        return null;

    }

    getNodeNo(x, y) {
        for (let i = 0; i < this.cycle.length; i++) {
            if (this.cycle[i].x === x && this.cycle[i].y === y) {
                return i;
            }
        }
        return -1;

    }

    getPossiblePositionsFrom(x, y) {
        let currentNode = this.cycle[this.getNodeNo(x, y)];
        let nodeNos = [];
        for (let n of currentNode.edges) {
            nodeNos.push(this.getNodeNo(n.x, n.y));
        }
        return nodeNos;
    }
}

Array.prototype.getRandomElement = function () {
    return this[floor(random(this.length))];
};

class HNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.spanningTreeAdjacentNodes = [];
        this.cycleNo = -1;

        //A* variables
        this.alreadyVisited = false;
        this.shortestDistanceToThisPoint = 0;

    }

    setEdges(allNodes) {
        this.edges = [];
        this.edges = allNodes.filter((n) => (dist(n.x, n.y, this.x, this.y) === 1));
    }

    setSpanningTreeEdges(spanningTree) {
        for (let e of spanningTree) {
            if (e.contains(this)) {
                this.spanningTreeAdjacentNodes.push(e.getOtherNode(this));
            }
        }
    }


    getNextNodeMovingLeft(previousNode) {
        let direction = previousNode.getDirectionTo(this);

        let possibleDirections = [];
        for (let n of this.spanningTreeAdjacentNodes) {
            possibleDirections.push(this.getDirectionTo(n));
        }

        let checkingDirection = getLeftOf(direction);
        while (!possibleDirections.includes(checkingDirection)) {
            checkingDirection = getRightOf(checkingDirection);
        }
        return this.spanningTreeAdjacentNodes[possibleDirections.indexOf(checkingDirection)];
    }


    getDirectionTo(other) {
        return {x: other.x - this.x, y: other.y - this.y};
    }

    resetForAStar(){
        this.alreadyVisited = false;
        this.shortestDistanceToThisPoint = 0;
    }

}

function getLeftOf(d) {
    if (d.x === 0 && d.y === 1) {
        return {x: 1, y: 0};
    } else if (d.x === 0 && d.y === -1) {
        return {x: -1, y: 0};
    } else if (d.x === 1) {
        return {x: 0, y: -1};
    } else {
        return {x: 0, y: 1};
    }
}

function getRightOf(d) {
    if (d.x === 0 && d.y === 1) {
        return {x: -1, y: 0};
    } else if (d.x === 0 && d.y === -1) {
        return {x: 1, y: 0};
    } else if (d.x === 1) {
        return {x: 0, y: 1};
    } else {
        return {x: 0, y: -1};
    }
}

class HEdge {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
    }

    isEqualTo(otherEdge) {
        return (this.node1 === otherEdge.node1 && this.node2 === otherEdge.node2) || (this.node1 === otherEdge.node2 && this.node2 === otherEdge.node1);
    }

    contains(n) {
        return (n === this.node1 || n === this.node2);
    }

    getOtherNode(n) {
        if (n === this.node1) {
            return this.node2;
        } else {
            return this.node1;
        }

    }


    connectNodes() {
        this.node1.spanningTreeAdjacentNodes.push(this.node2);
        this.node2.spanningTreeAdjacentNodes.push(this.node1);
    }
}


class HPath {
    constructor(startingNode, finishingNode) {

        this.pathLength = 0;
        this.nodesInPath = [startingNode];
        this.finishNode = finishingNode;

        this.distanceToApple = 0;
        this.setDistanceToApple();
        this.pathCounter = 0;
    }

    setDistanceToApple(){
        // this.distanceToApple = s.getDistanceBetweenPoints(this.getLastNode().cycleNo,this.finishNode.cycleNo);
        this.distanceToApple = dist(this.finishNode.x,this.finishNode.y,this.getLastNode().x,this.getLastNode().y);
    }

    addToTail(node){
        this.nodesInPath.push(node);
        this.pathLength +=1;
        this.setDistanceToApple();
    }
    getLastNode(){
        return this.nodesInPath[this.nodesInPath.length-1];
    }

    getSnakeTailPositionAfterFollowingPath(snake){
        if(this.pathLength-snake.addCount<snake.tailBlocks.length){
            return snake.tailBlocks[max(0, this.pathLength-snake.addCount)];
        }
        let tailMoved = this.pathLength-snake.addCount;
        // print(tailMoved,this.nodesInPath,snake.tailBlocks, this.nodesInPath[tailMoved-snake.tailBlocks.length]);
        return this.nodesInPath[tailMoved-snake.tailBlocks.length];
    }

    getNextMove() {
        let x = this.nodesInPath[this.pathCounter + 1].x - this.nodesInPath[this.pathCounter].x;
        let y = this.nodesInPath[this.pathCounter + 1].y - this.nodesInPath[this.pathCounter].y;
        this.pathCounter++;
        return {x, y};
    }

    clone() {
        let clone = new HPath(this.nodesInPath[0],this.finishNode);
        clone.nodesInPath = [...this.nodesInPath];
        clone.pathLength = this.pathLength;
        clone.distanceToApple = this.distanceToApple;

        return clone;
    }

}