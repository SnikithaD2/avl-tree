document.addEventListener("DOMContentLoaded", () => {

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
const container = document.getElementById("treeContainer");
const operationText = document.getElementById("operation");

/* AVL LOGIC */
function height(n) {
    return n ? n.height : 0;
}

function getBalance(n) {
    return n ? height(n.left) - height(n.right) : 0;
}

function rotateRight(y) {
    operationText.innerText = "Operation: Right Rotation";
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function rotateLeft(x) {
    operationText.innerText = "Operation: Left Rotation";
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
}

function insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) node.left = insert(node.left, value);
    else if (value > node.value) node.right = insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));
    let balance = getBalance(node);

    if (balance > 1 && value < node.left.value) return rotateRight(node);
    if (balance < -1 && value > node.right.value) return rotateLeft(node);
    if (balance > 1 && value > node.left.value) {
        node.left = rotateLeft(node.left);
        operationText.innerText = "Operation: Left-Right Rotation";
        return rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
        node.right = rotateRight(node.right);
        operationText.innerText = "Operation: Right-Left Rotation";
        return rotateLeft(node);
    }

    return node;
}

/* UI FUNCTIONS */
function insertValue() {
    const value = parseInt(document.getElementById("valueInput").value);
    if (isNaN(value)) return;
    root = insert(root, value);
    renderTree();
}

function deleteValue() {
    operationText.innerText = "Operation: Delete not implemented";
}

function resetTree() {
    root = null;
    container.innerHTML = "";
    operationText.innerText = "Operation: Reset";
}

/* DRAW TREE (DIV BASED) */
function renderTree() {
    container.innerHTML = "";
    if (!root) return;

    const width = container.clientWidth;
    setPosition(root, width / 2, 40, width / 4);
    draw(root);
}

function setPosition(node, x, y, gap) {
    node.x = x;
    node.y = y;
    if (node.left) setPosition(node.left, x - gap, y + 80, gap / 2);
    if (node.right) setPosition(node.right, x + gap, y + 80, gap / 2);
}

function draw(node) {
    if (node.left) drawLine(node, node.left);
    if (node.right) drawLine(node, node.right);

    const div = document.createElement("div");
    div.className = "node";
    div.style.left = node.x - 22 + "px";
    div.style.top = node.y - 22 + "px";
    div.innerText = node.value;
    container.appendChild(div);

    if (node.left) draw(node.left);
    if (node.right) draw(node.right);
}

function drawLine(p, c) {
    const line = document.createElement("div");

    const dx = c.x - p.x;
    const dy = c.y - p.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    line.className = "line";
    line.style.width = length + "px";
    line.style.left = p.x + "px";
    line.style.top = p.y + "px";
    line.style.transform = `rotate(${angle}deg)`;

    container.appendChild(line);
}
