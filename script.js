class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
let operationText = "None";

/* ---------- AVL LOGIC ---------- */

function height(node) {
    return node ? node.height : 0;
}

function getBalance(node) {
    return node ? height(node.left) - height(node.right) : 0;
}

function rightRotate(y) {
    operationText = "Right Rotation (LL Case)";
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function leftRotate(x) {
    operationText = "Left Rotation (RR Case)";
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

    if (value < node.value)
        node.left = insert(node.left, value);
    else if (value > node.value)
        node.right = insert(node.right, value);
    else
        return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));
    let balance = getBalance(node);

    if (balance > 1 && value < node.left.value)
        return rightRotate(node);

    if (balance < -1 && value > node.right.value)
        return leftRotate(node);

    if (balance > 1 && value > node.left.value) {
        operationText = "Left-Right Rotation (LR Case)";
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    if (balance < -1 && value < node.right.value) {
        operationText = "Right-Left Rotation (RL Case)";
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    operationText = "Inserted (No Rotation)";
    return node;
}

function minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
}

function deleteNode(root, value) {
    if (!root) return root;

    if (value < root.value)
        root.left = deleteNode(root.left, value);
    else if (value > root.value)
        root.right = deleteNode(root.right, value);
    else {
        operationText = "Node Deleted";
        if (!root.left || !root.right) {
            root = root.left || root.right;
        } else {
            let temp = minValueNode(root.right);
            root.value = temp.value;
            root.right = deleteNode(root.right, temp.value);
        }
    }

    if (!root) return root;

    root.height = 1 + Math.max(height(root.left), height(root.right));
    let balance = getBalance(root);

    if (balance > 1 && getBalance(root.left) >= 0)
        return rightRotate(root);

    if (balance > 1 && getBalance(root.left) < 0) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    if (balance < -1 && getBalance(root.right) <= 0)
        return leftRotate(root);

    if (balance < -1 && getBalance(root.right) > 0) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }

    return root;
}

/* ---------- UI FUNCTIONS ---------- */

function insertValue() {
    const val = parseInt(document.getElementById("valueInput").value);
    if (isNaN(val)) return alert("Enter a value");
    root = insert(root, val);
    drawTree();
}

function deleteValue() {
    const val = parseInt(document.getElementById("valueInput").value);
    if (isNaN(val)) return alert("Enter a value");
    root = deleteNode(root, val);
    drawTree();
}

function resetTree() {
    root = null;
    operationText = "Tree Reset";
    drawTree();
}

/* ---------- SVG DRAWING ---------- */

function drawTree() {
    document.getElementById("operation").innerText =
        "Operation: " + operationText;

    const svg = document.getElementById("treeSvg");
    svg.innerHTML = "";

    if (root) {
        drawNode(svg, root, 450, 40, 200);
    }
}

function drawNode(svg, node, x, y, gap) {
    if (!node) return;

    if (node.left) {
        drawLine(svg, x, y, x - gap, y + 80);
        drawNode(svg, node.left, x - gap, y + 80, gap / 1.6);
    }

    if (node.right) {
        drawLine(svg, x, y, x + gap, y + 80);
        drawNode(svg, node.right, x + gap, y + 80, gap / 1.6);
    }

    // Circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 22);
    circle.setAttribute("fill", "#2e7d32");
    svg.appendChild(circle);

    // Text
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "14");
    text.textContent = node.value;
    svg.appendChild(text);
}

function drawLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#000");
    line.setAttribute("stroke-width", "2"); // 🔥 IMPORTANT
    svg.appendChild(line);
}
