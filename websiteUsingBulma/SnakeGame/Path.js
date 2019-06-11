class Path {


    constructor() {
        this.pathLength = 0;
        this.distanceToApple = 0;
        this.nodesInPath = [];
        this.trapSize = 0;
        this.pathCounter = 0;
    }


    addToTail(n) {
        if (this.nodesInPath.length !== 0) {
            let currentLast = this.nodesInPath[this.nodesInPath.length - 1];
            this.pathLength += dist(currentLast.x, currentLast.y, n.x, n.y);
        }
        this.nodesInPath.push(n);
        this.distanceToApple = dist(n.x, n.y, s.apple.x, s.apple.y);
    }

    addToTailAStar(n) {
        if (this.nodesInPath.length !== 0) {
            let currentLast = this.nodesInPath[this.nodesInPath.length - 1];
            this.pathLength += dist(currentLast.x, currentLast.y, n.x, n.y);
        }
        this.nodesInPath.push(n);
        this.distanceToApple = abs(n.x - s.apple.x) + abs(n.y - s.apple.y);
        // dist(n.x, n.y, s.apple.x, s.apple.y);
    }

    clone() {
        let clone = new Path();
        clone.nodesInPath = [...this.nodesInPath];
        clone.pathLength = this.pathLength;
        clone.distanceToApple = this.distanceToApple;
        return clone;
    }

    getLastNode() {
        if (this.nodesInPath === [])
            return null;
        return (this.nodesInPath[this.nodesInPath.length - 1]);

    }


    getNodeInPosition(x, y) {
        for (var n of this.nodesInPath) {
            if (n.x === x && n.y === y)
                return n;
        }
        return null;
    }

    getNextMove() {
        let x = this.nodesInPath[this.pathCounter + 1].x - this.nodesInPath[this.pathCounter].x;
        let y = this.nodesInPath[this.pathCounter + 1].y - this.nodesInPath[this.pathCounter].y;
        this.pathCounter++;
        return {x, y};
    }

    print() {
        //     print("YAY we got one");
        for (var n of this.nodesInPath) {
            print(n);
            // print(n);
        }
    }

    nodeInPath(n) {
        for (let node of this.nodesInPath) {
            if (node == n) {
                return true;
            }
        }
        return false;
    }


    getFinalSnakePosition() {
        //trap is defined as creating a hole which contains less than half the blocks
        //need a way of counting the blocks

        let currentSnakePositions = [];
        for (let i = 0; i < s.tailBlocks.length; i++) {
            if (i < this.pathLength - s.addCount) {
                // // print("not in snake ",s.tailBlocks[i], i,this.pathLength,s.addCount);
                continue;
            }
            let tailBlock = s.tailBlocks[i];
            let nodeArrayPosition = tailBlock.y + blocksY * tailBlock.x;

            currentSnakePositions.push(nodes[nodeArrayPosition]);
        }


        // // print(currentSnakePositions.length + " from snake");
        //add things from path;
        for (let i = 0; i < this.nodesInPath.length; i++) {
            if (this.pathLength - i > s.tailBlocks.length + 1 + s.addCount) {
                continue;
            }
            currentSnakePositions.push(this.nodesInPath[i]);
        }

        // // print(currentSnakePositions.length + " from snake and path");

        // // print(s.tailBlocks.length +1,this.pathLength,currentSnakePositions);

        return currentSnakePositions;
    }

    isPathATrap() {
        let futureSnakePosition = this.getFinalSnakePosition();
        let snakeHead = futureSnakePosition[futureSnakePosition.length - 1];

        let reachableNodes = [snakeHead];


        for (let i = 0; i < reachableNodes.length; i++) {
            let currentNode = reachableNodes[i];
            for (let n of currentNode.edges) {
                if (!futureSnakePosition.includes(n) && !reachableNodes.includes(n)) {

                    reachableNodes.push(n);
                }
            }
        }
        this.trapSize = reachableNodes.length;
        //returns true if the number of reachableNodes is less than a third of the remaining nodes
        return (nodes.length - reachableNodes.length) * 0.9 > reachableNodes.length;

    }

    doesPathSplitArea() {
        //tests whether 90% of all nodes are connected

        let futureSnakePosition = this.getFinalSnakePosition();
        let snakeHead = futureSnakePosition[futureSnakePosition.length - 1];

        let reachableNodes = [];
        for (let snakeHeadEdge of snakeHead.edges) {
            if (!futureSnakePosition.includes(snakeHeadEdge)) {
                reachableNodes = [snakeHeadEdge];
                for (let i = 0; i < reachableNodes.length; i++) {
                    let currentNode = reachableNodes[i];
                    for (let n of currentNode.edges) {
                        if (!futureSnakePosition.includes(n) && !reachableNodes.includes(n)) {
                            reachableNodes.push(n);
                        }
                    }
                }

                if ((nodes.length - futureSnakePosition.length) * 0.9 <= reachableNodes.length) {
                    return false;
                }

            }
        }
        return true;
        //
        // //returns true if the number of reachableNodes is less than a third of the remaining nodes
        // return (nodes.length - reachableNodes.length) * 0.9 > reachableNodes.length;

    }


    pathCannotBecomeAHamiltonianCycle() {
        //if any position not in the path is not connected to all other positions then this path cannot be a hamiltonian
        if (this.nodesInPath.length === nodes.length)
            return false;

        let reachableNodes = [];
        for(var n of this.nodesInPath[0].edges){
            if (!this.nodeInPath(n)) {
                reachableNodes = [n];
                break;
            }
        }

        for (let i = 0; i < reachableNodes.length; i++) {
            let currentNode = reachableNodes[i];
            for (let n of currentNode.edges) {
                if (!this.nodeInPath(n) && !reachableNodes.includes(n)) {
                    reachableNodes.push(n);
                }
            }
        }


        if( nodes.length !== reachableNodes.length + this.nodesInPath.length){
            // print("nope this bitch aint one");
            // print(nodes.length, reachableNodes.length, this.pathLength);
            // this.print();
            return true;
        }
        return false;
    }

    getMainAreaSize() {

        let futureSnakePosition = this.getFinalSnakePosition();
        let snakeHead = futureSnakePosition[futureSnakePosition.length - 1];
        let maxArea = 0;
        let reachableNodes = [];
        for (let snakeHeadEdge of snakeHead.edges) {
            if (!futureSnakePosition.includes(snakeHeadEdge)) {
                reachableNodes = [snakeHeadEdge];
                for (let i = 0; i < reachableNodes.length; i++) {
                    let currentNode = reachableNodes[i];
                    for (let n of currentNode.edges) {
                        if (!futureSnakePosition.includes(n) && !reachableNodes.includes(n)) {
                            reachableNodes.push(n);
                        }
                    }
                }

                maxArea = max(maxArea, reachableNodes.length);
            }
        }
        return maxArea;
    }


}


class Node {

    constructor(x, y, blocked, blockedTimer, isApple) {
        this.x = x;
        this.y = y;
        this.shortestDistanceToThisPoint = 10000;
        this.longestDistanceToThisPoint = 0;

        this.blocked = blocked;
        this.blockedTimer = blockedTimer;//this is the number of moves before this square is free

        this.edges = [];
        this.isApple = isApple;
        this.partOfWinningPath = false;
        this.alreadyVisited = false;
    }

    //fills the edge array based on the nodes array
    setEdges() {
        this.edges = [];
        this.edges = nodes.filter((n) => (dist(n.x, n.y, this.x, this.y) === 1));

        // for (var n of nodes) {
        //     if (n.x === this.x ^ n.y === this.y) {
        //         if (dist(n.x, n.y, this.x, this.y) === 1) {
        //             this.edges.push(n);
        //         }
        //     }
        // }
    }
}


let nodes = [];

function setNodes() {
    nodes = [];
    for (let i = 0; i < blocksX; i++) {
        for (let j = 0; j < blocksY; j++) {
            nodes.push(new Node(i, j, false, 0, s.apple.isAtPosition(i, j)));
        }
    }

    for (let i = 0; i < s.tailBlocks.length; i++) {
        let tailBlock = s.tailBlocks[i];
        let nodeArrayPosition = tailBlock.y + blocksY * tailBlock.x;
        nodes[nodeArrayPosition].blocked = true;
        nodes[nodeArrayPosition].blockedTimer = i + s.addCount;
    }

    for (let n of nodes) {
        n.setEdges();
    }
}


function createHamiltonianCycle() {
    setNodes();

    let startNode = nodes[floor(random(nodes.length))];
    let bigList = [];
    let startingPath = new Path();

    startingPath.addToTailAStar(startNode);
    bigList.push(startingPath);


    while (true) {
        print(bigList.length);


        let currentPath = bigList.shift();
        if (currentPath.nodesInPath.length === nodes.length) {
            currentPath.print();
            return currentPath;
        }
        let finalNodeInPath = currentPath.getLastNode();

        //now we need to add all the paths possible from this node to the bigList

        for (var n of finalNodeInPath.edges) {
            if (currentPath.nodeInPath(n)) {
                continue;
            }
            let p = currentPath.clone();
            p.addToTailAStar(n);

            if (p.pathCannotBecomeAHamiltonianCycle())
                continue;
            bigList.unshift(p);
        }


    }


}

function getBestPathFromSnakeToApple() {
    setNodes();
    let startNode = getSnakeHeadNode();
    let bigList = [];
    let winningPath;
    let startingPath = new Path();
    startingPath.addToTailAStar(startNode);
    bigList.push(startingPath);


    while (true) {
        // print(bigList.length);
        if (bigList.length === 0) {
            // // (!winningPath) ? print("No Path found") : winningPath.print();
            return winningPath;
        }
        let currentPath = bigList.shift();
        if (winningPath && currentPath.pathLength >= winningPath.pathLength) {
            continue;
        }

        if (currentPath.distanceToApple === 0) {//path has found apple

            return currentPath;

            // if (winningPath == null || currentPath.pathLength < winningPath.pathLength) {
            //
            //     winningPath = currentPath.clone();
            //
            // }
            // continue;
        }


        //if the final node has been visited and the previous visit was a shorter path then fuck this path
        let finalNodeInPath = currentPath.getLastNode();

        if (!finalNodeInPath.alreadyVisited || currentPath.pathLength < finalNodeInPath.shortestDistanceToThisPoint) {

            //this is the shortest found path to this point
            finalNodeInPath.alreadyVisited = true;
            finalNodeInPath.shortestDistanceToThisPoint = currentPath.pathLength;

            //now we need to add all the paths possible from this node to the bigList

            for (var n of finalNodeInPath.edges) {

                if (n.blocked && n.blockedTimer > currentPath.pathLength) {
                    continue;
                }
                let p = currentPath.clone();
                p.addToTailAStar(n);
                if (p.getLastNode().alreadyVisited && p.pathLength > p.getLastNode().shortestDistanceToThisPoint) {
                    continue;
                }
                if (p.doesPathSplitArea())
                    continue;

                bigList.push(p);
            }
        }

        //now we need to sort the bigList based on the distances to the apple plus the current distance of the path
        bigList.sort((a, b) => ((a.distanceToApple + a.pathLength) - (b.distanceToApple + b.pathLength)));

    }

}

function getSnakeHeadNode() {
    return nodes.filter((n) => n.x === s.x && n.y === s.y)[0];
}


function getLongestPathFromSnakeToApple() {
    setNodes();
    let startNode = getSnakeHeadNode();
    let bigList = [];
    let winningPath;
    let startingPath = new Path();
    startingPath.addToTail(startNode);
    bigList.push(startingPath);


    while (true) {

        if (bigList.length === 0) {
            // // (!winningPath) ? print("No Path found") : winningPath.print();
            return winningPath;
        }
        let currentPath = bigList.shift();
        // if(winningPath && currentPath.pathLength>= winningPath.pathLength){
        //     continue;
        // }

        if (currentPath.distanceToApple === 0) {//path has found apple
            if (winningPath == null || currentPath.pathLength > winningPath.pathLength) {
                winningPath = currentPath.clone();

            }
            continue;
        }


        //if the final node has been visited and the previous visit was a shorter path then fuck this path
        let finalNodeInPath = currentPath.getLastNode();

        if (!finalNodeInPath.alreadyVisited || currentPath.pathLength > finalNodeInPath.longestDistanceToThisPoint) {

            //this is the shortest found path to this point
            finalNodeInPath.alreadyVisited = true;
            finalNodeInPath.longestDistanceToThisPoint = currentPath.pathLength;

            //now we need to add all the paths possible from this node to the bigList

            for (var n of finalNodeInPath.edges) {

                if (n.blocked && n.blockedTimer > currentPath.pathLength) {
                    continue;
                }
                if (currentPath.nodeInPath(n)) {
                    continue;
                }
                let p = currentPath.clone();
                p.addToTail(n);
                if (p.getLastNode().alreadyVisited && p.pathLength < p.getLastNode().longestDistanceToThisPoint) {
                    continue;
                }
                if (p.doesPathSplitArea())
                    continue;

                bigList.push(p);
            }
        }

        //now we need to sort the bigList based on the distances to the apple plus the current distance of the path
        bigList.sort((a, b) => -1 * ((a.distanceToApple + a.pathLength) - (b.distanceToApple + b.pathLength)));

    }

}

function getPathFromSnakeToApplePrioritisingTrapSize() {
    setNodes();
    let startNode = getSnakeHeadNode();
    let bigList = [];
    let winningPath;
    let startingPath = new Path();
    startingPath.addToTail(startNode);
    bigList.push(startingPath);


    while (true) {
        // print(bigList.length);
        if (bigList.length === 0) {
            // // (!winningPath) ? print("No Path found") : winningPath.print();
            return winningPath;
        }
        let currentPath = bigList.shift();
        // if(winningPath && currentPath.pathLength>= winningPath.pathLength){
        //     continue;
        // }

        if (currentPath.distanceToApple === 0) {//path has found apple
            currentPath.isPathATrap();//calculatesTrapSize
            if (winningPath == null || currentPath.trapSize > winningPath.trapSize) {
                winningPath = currentPath.clone();
                return winningPath;
                // if(currentPath.trapSize > (nodes.length - (s.tailBlocks.length+5))*0.75){
                //     return winningPath;
                // }
            }
            continue;
        }


        //if the final node has been visited and the previous visit was a shorter path then fuck this path
        let finalNodeInPath = currentPath.getLastNode();

        if (!finalNodeInPath.alreadyVisited || currentPath.pathLength > finalNodeInPath.longestDistanceToThisPoint) {

            //this is the shortest found path to this point
            finalNodeInPath.alreadyVisited = true;
            finalNodeInPath.longestDistanceToThisPoint = currentPath.pathLength;
            //now we need to add all the paths possible from this node to the bigList

            for (var n of finalNodeInPath.edges) {

                if (n.blocked && n.blockedTimer > currentPath.pathLength) {
                    continue;
                }
                if (currentPath.nodeInPath(n)) {
                    continue;
                }
                let p = currentPath.clone();
                p.addToTail(n);
                if (p.doesPathSplitArea())
                    continue;
                // if(winningPath && p.trapSize> winningPath)
                //     continue;

                // if (p.getLastNode().alreadyVisited && p.pathLength < p.getLastNode().longestDistanceToThisPoint) {
                //     continue;
                // }
                bigList.push(p);
            }
        }

        //now we need to sort the bigList based on the distances to the apple plus the current distance of the path
        bigList.sort((a, b) => -1 * ((a.distanceToApple + a.pathLength) - (b.distanceToApple + b.pathLength)));

    }

}


function survivalMode() {
    setNodes();
    let startNode = getSnakeHeadNode();
    let bigList = [];

    let bestPath = new Path();
    let pathOptions = [];
    bestPath.addToTail(startNode);


    for (let i = 0; i < 5; i++) {
        pathOptions = [];
        let finalNodeInPath = bestPath.getLastNode();
        for (var n of finalNodeInPath.edges) {

            if (n.blocked && n.blockedTimer > bestPath.pathLength) {
                continue;
            }

            if (bestPath.nodeInPath(n)) {
                continue;
            }
            let p = bestPath.clone();
            p.addToTail(n);
            // if (p.doesPathSplitArea())
            //     continue;
            pathOptions.push(p);
        }

        let maxMainArea = 0;
        let maxIndex = 0;
        for (var j = 0; j < pathOptions.length; j++) {
            let mainAreaSize = pathOptions[j].getMainAreaSize();
            if (mainAreaSize > maxMainArea) {
                maxIndex = j;
                maxMainArea = mainAreaSize;
            }
        }
        if (pathOptions.length > 0) {
            bestPath = pathOptions[maxIndex];
        }
    }
    // print(bestPath);
    return bestPath;

}

function survivalMode2() {
    setNodes();
    let startNode = getSnakeHeadNode();
    let bigList = [];

    let bestPath = new Path();

    bestPath.addToTail(startNode);
    let pathOptions = [bestPath];

    for (let i = 0; i < 5; i++) {
        bigList = [];
        for (let path of pathOptions) {
            let finalNodeInPath = path.getLastNode();
            for (var n of finalNodeInPath.edges) {

                if (n.blocked && n.blockedTimer > path.pathLength) {
                    continue;
                }

                if (path.nodeInPath(n)) {
                    continue;
                }
                let p = path.clone();
                p.addToTail(n);
                bigList.push(p);
            }
        }
        if (bigList.length === 0) {
            print("made it to " + i);
            break;
        }
        pathOptions = [...bigList];
    }


    let maxMainArea = 0;
    let maxIndex = 0;
    for (var j = 0; j < pathOptions.length; j++) {
        let mainAreaSize = pathOptions[j].getMainAreaSize();
        if (mainAreaSize > maxMainArea) {
            maxIndex = j;
            maxMainArea = mainAreaSize;
        }
    }

    if (pathOptions.length > 0) {
        bestPath = pathOptions[maxIndex];
    }


    print(bestPath);
    return bestPath;

}