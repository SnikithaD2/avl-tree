class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;

// Get height
function height(node) {
    return node ? node.height : 0;
}

// Get balance factor
function getBalance(node) {
    return node ? height(node.left) - height(node.right) : 0;
}

// Right rotation
function rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

// Left rotation
function leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
}

// Insert node
function insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value)
        node.left = insert(node.left, value);
    else if (value > node.value)
        node.right = insert(node.right, value);
    else
        return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));
    const balance = getBalance(node);

    // LL
    if (balance > 1 && value < node.left.value)
        return rightRotate(node);

    // RR
    if (balance < -1 && value > node.right.value)
        return leftRotate(node);

    // LR
    if (balance > 1 && value > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL
    if (balance < -1 && value < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Insert handler
function insertValue() {
    const value = document.getElementById("value").value;
    if (value === "") return alert("Enter a value");

    root = insert(root, parseInt(value));
    document.getElementById("value").value = "";
    renderTree();
}

// Render tree (level-order)
function renderTree() {
    const treeDiv = document.getElementById("tree");
    treeDiv.innerHTML = "";

    if (!root) return;

    let queue = [root];

    while (queue.length > 0) {
        let size = queue.length;
        let levelDiv = document.createElement("div");
        levelDiv.className = "level";

        for (let i = 0; i < size; i++) {
            let node = queue.shift();

            let nodeDiv = document.createElement("div");
            nodeDiv.className = "node";
            nodeDiv.innerText = node.value;
            levelDiv.appendChild(nodeDiv);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        treeDiv.appendChild(levelDiv);
    }
          }
