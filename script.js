class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
let operationText = "";

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

    operationText = "Inserted without rotation";
    return node;
}

function minValueNode(node) {
    let current = node;
    while (current.left)
        current = current.left;
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
        operationText = "Left-Right Rotation";
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    if (balance < -1 && getBalance(root.right) <= 0)
        return leftRotate(root);

    if (balance < -1 && getBalance(root.right) > 0) {
        operationText = "Right-Left Rotation";
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }

    return root;
}

/* ---------- UI FUNCTIONS ---------- */

function insertValue() {
    const value = parseInt(document.getElementById("valueInput").value);
    if (isNaN(value)) return alert("Enter a value");
    operationText = "";
    root = insert(root, value);
    updateUI();
}

function deleteValue() {
    const value = parseInt(document.getElementById("valueInput").value);
    if (isNaN(value)) return alert("Enter a value");
    root = deleteNode(root, value);
    updateUI();
}

function resetTree() {
    root = null;
    operationText = "Tree Reset";
    updateUI();
}

function updateUI() {
    document.getElementById("operation").innerText = "Operation: " + operationText;
    const container = document.getElementById("treeContainer");
    container.innerHTML = "";
    if (root) container.appendChild(renderTree(root));
}

function renderTree(node) {
    if (!node) return null;

    const div = document.createElement("div");
    div.className = "node";
    div.innerText = node.value;

    if (node.left || node.right) {
        const children = document.createElement("div");
        children.className = "children";

        children.appendChild(node.left ? renderTree(node.left) : document.createElement("div"));
        children.appendChild(node.right ? renderTree(node.right) : document.createElement("div"));

        div.appendChild(children);
    }

    return div;
}
