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

// Utility functions
function height(node) {
    return node ? node.height : 0;
}

function getBalance(node) {
    return node ? height(node.left) - height(node.right) : 0;
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
    let balance = getBalance(node);

    // LL
    if (balance > 1 && value < node.left.value) {
        operationText = "LL Rotation (Right Rotate)";
        return rightRotate(node);
    }

    // RR
    if (balance < -1 && value > node.right.value) {
        operationText = "RR Rotation (Left Rotate)";
        return leftRotate(node);
    }

    // LR
    if (balance > 1 && value > node.left.value) {
        operationText = "LR Rotation (Left + Right Rotate)";
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL
    if (balance < -1 && value < node.right.value) {
        operationText = "RL Rotation (Right + Left Rotate)";
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Insert handler
function insertValue() {
    const input = document.getElementById("value");
    if (input.value === "") {
        alert("Enter a value");
        return;
    }

    operationText = "No rotation needed";
    root = insert(root, parseInt(input.value));

    document.getElementById("operation").innerText =
        "Operation: " + operationText;

    input.value = "";
    renderTree();
}

// Render tree
function renderTree() {
    const container = document.getElementById("tree-container");
    container.innerHTML = "";
    if (!root) return;

    container.appendChild(createNode(root));
}

function createNode(node) {
    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    const nodeDiv = document.createElement("div");
    nodeDiv.className = "node";
    nodeDiv.innerText = node.value;
    wrapper.appendChild(nodeDiv);

    if (node.left || node.right) {
        if (node.left) {
            const leftLine = document.createElement("div");
            leftLine.className = "line left-line";
            wrapper.appendChild(leftLine);
        }

        if (node.right) {
            const rightLine = document.createElement("div");
            rightLine.className = "line right-line";
            wrapper.appendChild(rightLine);
        }

        const childrenDiv = document.createElement("div");
        childrenDiv.className = "children";

        if (node.left) childrenDiv.appendChild(createNode(node.left));
        if (node.right) childrenDiv.appendChild(createNode(node.right));

        wrapper.appendChild(childrenDiv);
    }

    return wrapper;
}
