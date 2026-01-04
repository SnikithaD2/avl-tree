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

function height(n) {
    return n ? n.height : 0;
}

function balance(n) {
    return n ? height(n.left) - height(n.right) : 0;
}

function rightRotate(y) {
    operationText = "Right Rotation (LL Case)";
    let x = y.left;
    let t2 = x.right;

    x.right = y;
    y.left = t2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
}

function leftRotate(x) {
    operationText = "Left Rotation (RR Case)";
    let y = x.right;
    let t2 = y.left;

    y.left = x;
    x.right = t2;

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
    let b = balance(node);

    if (b > 1 && value < node.left.value)
        return rightRotate(node);

    if (b < -1 && value > node.right.value)
        return leftRotate(node);

    if (b > 1 && value > node.left.value) {
        operationText = "Left-Right Rotation (LR Case)";
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    if (b < -1 && value < node.right.value) {
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
        if (!root.left || !root.right)
            root = root.left || root.right;
        else {
            let temp = minValueNode(root.right);
            root.value = temp.value;
            root.right = deleteNode(root.right, temp.value);
        }
    }

    if (!root) return root;

    root.height = 1 + Math.max(height(root.left), height(root.right));
    let b = balance(root);

    if (b > 1 && balance(root.left) >= 0)
        return rightRotate(root);

    if (b > 1 && balance(root.left) < 0) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    if (b < -1 && balance(root.right) <= 0)
        return leftRotate(root);

    if (b < -1 && balance(root.right) > 0) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }

    return root;
}

/* ---------- UI ---------- */

function insertValue() {
    const v = parseInt(document.getElementById("valueInput").value);
    if (isNaN(v)) return alert("Enter a number");
    root = insert(root, v);
    draw();
}

function deleteValue() {
    const v = parseInt(document.getElementById("valueInput").value);
    if (isNaN(v)) return alert("Enter a number");
    root = deleteNode(root, v);
    draw();
}

function resetTree() {
    root = null;
    operationText = "Tree Reset";
    draw();
}

function draw() {
    document.getElementById("operation").innerText =
        "Operation: " + operationText;

    const container = document.getElementById("treeContainer");
    container.innerHTML = "";

    if (root) {
        const tree = document.createElement("div");
        tree.className = "tree";
        tree.appendChild(render(root));
        container.appendChild(tree);
    }
}

function render(node) {
    if (!node) return document.createElement("div");

    const wrapper = document.createElement("div");
    wrapper.className = "node-wrapper";

    // 👇 NODE CIRCLE
    const circle = document.createElement("div");
    circle.className = "node";
    circle.innerText = node.value;
    wrapper.appendChild(circle);

    // 👇 CHILDREN
    if (node.left || node.right) {
        const children = document.createElement("div");
        children.className = "children";

        children.appendChild(node.left ? render(node.left) : document.createElement("div"));
        children.appendChild(node.right ? render(node.right) : document.createElement("div"));

        wrapper.appendChild(children);
    }

    return wrapper;
}
