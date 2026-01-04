class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
const svg = document.getElementById("treeCanvas");

function height(n) {
    return n ? n.height : 0;
}

function balanceFactor(n) {
    return n ? height(n.left) - height(n.right) : 0;
}

function updateHeight(n) {
    n.height = 1 + Math.max(height(n.left), height(n.right));
}

function rotateRight(y) {
    document.getElementById("operation").innerText = "Operation: Right Rotation";
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);
    return x;
}

function rotateLeft(x) {
    document.getElementById("operation").innerText = "Operation: Left Rotation";
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);
    return y;
}

function insertNode(node, value) {
    if (!node) return new Node(value);

    if (value < node.value)
        node.left = insertNode(node.left, value);
    else if (value > node.value)
        node.right = insertNode(node.right, value);
    else
        return node;

    updateHeight(node);

    let balance = balanceFactor(node);

    if (balance > 1 && value < node.left.value)
        return rotateRight(node);

    if (balance < -1 && value > node.right.value)
        return rotateLeft(node);

    if (balance > 1 && value > node.left.value) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }

    return node;
}

function minValueNode(node) {
    while (node.left) node = node.left;
    return node;
}

function deleteAVL(node, value) {
    if (!node) return node;

    if (value < node.value)
        node.left = deleteAVL(node.left, value);
    else if (value > node.value)
        node.right = deleteAVL(node.right, value);
    else {
        document.getElementById("operation").innerText = "Operation: Delete " + value;

        if (!node.left || !node.right)
            node = node.left || node.right;
        else {
            let temp = minValueNode(node.right);
            node.value = temp.value;
            node.right = deleteAVL(node.right, temp.value);
        }
    }

    if (!node) return node;

    updateHeight(node);

    let balance = balanceFactor(node);

    if (balance > 1 && balanceFactor(node.left) >= 0)
        return rotateRight(node);

    if (balance > 1 && balanceFactor(node.left) < 0) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
    }

    if (balance < -1 && balanceFactor(node.right) <= 0)
        return rotateLeft(node);

    if (balance < -1 && balanceFactor(node.right) > 0) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
    }

    return node;
}

function insert() {
    let val = parseInt(document.getElementById("valueInput").value);
    if (isNaN(val)) return alert("Enter a value");
    document.getElementById("operation").innerText = "Operation: Insert " + val;
    root = insertNode(root, val);
    drawTree();
}

function deleteNode() {
    let val = parseInt(document.getElementById("valueInput").value);
    if (isNaN(val)) return alert("Enter a value");
    root = deleteAVL(root, val);
    drawTree();
}

function resetTree() {
    root = null;
    svg.innerHTML = "";
    document.getElementById("operation").innerText = "Operation: Reset Tree";
}

function drawTree() {
    svg.innerHTML = "";

    if (!root) return;

    const svgWidth = svg.clientWidth;   // actual width
    const startX = svgWidth / 2;         // center
    const startY = 50;
    const gap = svgWidth / 4;            // dynamic spacing

    drawNode(root, startX, startY, gap);
}

function drawNode(node, x, y, gap) {
    if (node.left) {
        drawLine(x, y, x - gap, y + 80);
        drawNode(node.left, x - gap, y + 80, gap / 2);
    }
    if (node.right) {
        drawLine(x, y, x + gap, y + 80);
        drawNode(node.right, x + gap, y + 80, gap / 2);
    }

    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", "#4CAF50");

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.textContent = node.value;

    svg.appendChild(circle);
    svg.appendChild(text);
}

function drawLine(x1, y1, x2, y2) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    svg.appendChild(line);
}
