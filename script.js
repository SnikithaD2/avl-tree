class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

let root = null;
let operationText = "None";
const svg = document.getElementById("tree");

// Utility
function height(n) {
    return n ? n.height : 0;
}

function balance(n) {
    return n ? height(n.left) - height(n.right) : 0;
}

// Rotations
function rightRotate(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
}

// Insert
function insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value)
        node.left = insert(node.left, value);
    else if (value > node.value)
        node.right = insert(node.right, value);
    else
        return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));
    let b = balance(node);

    if (b > 1 && value < node.left.value) {
        operationText = "LL Rotation";
        return rightRotate(node);
    }

    if (b < -1 && value > node.right.value) {
        operationText = "RR Rotation";
        return leftRotate(node);
    }

    if (b > 1 && value > node.left.value) {
        operationText = "LR Rotation";
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    if (b < -1 && value < node.right.value) {
        operationText = "RL Rotation";
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Insert handler
function insertValue() {
    const v = document.getElementById("value").value;
    if (v === "") return alert("Enter a value");

    operationText = "No rotation needed";
    root = insert(root, parseInt(v));
    document.getElementById("operation").innerText =
        "Operation: " + operationText;

    document.getElementById("value").value = "";
    drawTree();
}

// Layout tree
function setPositions(node, x, y, gap) {
    if (!node) return;

    node.x = x;
    node.y = y;

    setPositions(node.left, x - gap, y + 80, gap / 2);
    setPositions(node.right, x + gap, y + 80, gap / 2);
}

// Draw tree
function drawTree() {
    svg.innerHTML = "";
    if (!root) return;

    setPositions(root, 500, 40, 200);
    drawNode(root);
}

function drawNode(node) {
    if (node.left) {
        drawLine(node, node.left);
        drawNode(node.left);
    }
    if (node.right) {
        drawLine(node, node.right);
        drawNode(node.right);
    }

    drawCircle(node);
}

function drawLine(p, c) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p.x);
    line.setAttribute("y1", p.y);
    line.setAttribute("x2", c.x);
    line.setAttribute("y2", c.y);
    line.setAttribute("stroke", "black");
    svg.appendChild(line);
}

function drawCircle(node) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 18);
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "black");
    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-weight", "bold");
    text.textContent = node.value;
    svg.appendChild(text);
}
