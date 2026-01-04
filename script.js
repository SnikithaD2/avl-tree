const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const operationText = document.getElementById("operation");

let root = null;

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

// ---------- AVL UTILITIES ----------
function height(n) {
  return n ? n.height : 0;
}

function getBalance(n) {
  return n ? height(n.left) - height(n.right) : 0;
}

function rightRotate(y) {
  operationText.innerText = "Operation: Right Rotation";
  let x = y.left;
  let T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;

  return x;
}

function leftRotate(x) {
  operationText.innerText = "Operation: Left Rotation";
  let y = x.right;
  let T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = Math.max(height(x.left), height(x.right)) + 1;
  y.height = Math.max(height(y.left), height(y.right)) + 1;

  return y;
}

// ---------- INSERT ----------
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
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }

  if (balance < -1 && value < node.right.value) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  operationText.innerText = "Operation: Insert";
  return node;
}

// ---------- DELETE ----------
function minValueNode(node) {
  while (node.left) node = node.left;
  return node;
}

function deleteNode(root, value) {
  if (!root) return root;

  if (value < root.value)
    root.left = deleteNode(root.left, value);
  else if (value > root.value)
    root.right = deleteNode(root.right, value);
  else {
    operationText.innerText = "Operation: Delete";

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

// ---------- DRAW ----------
function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!root) return;
  setPositions(root, canvas.width / 2, 60, canvas.width / 4);
  drawEdges(root);
  drawNodes(root);
}

function setPositions(node, x, y, gap) {
  if (!node) return;
  node.x = x;
  node.y = y;
  setPositions(node.left, x - gap, y + 80, gap / 2);
  setPositions(node.right, x + gap, y + 80, gap / 2);
}

function drawEdges(node) {
  if (!node) return;

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;

  if (node.left) {
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(node.left.x, node.left.y);
    ctx.stroke();
  }

  if (node.right) {
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(node.right.x, node.right.y);
    ctx.stroke();
  }

  drawEdges(node.left);
  drawEdges(node.right);
}

function drawNodes(node) {
  if (!node) return;

  ctx.beginPath();
  ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#7CB342";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, node.x, node.y);

  drawNodes(node.left);
  drawNodes(node.right);
}

// ---------- CONTROLS ----------
function insertValue() {
  let v = parseInt(valueInput.value);
  if (isNaN(v)) return;
  root = insert(root, v);
  drawTree();
  valueInput.value = "";
}

function deleteValue() {
  let v = parseInt(valueInput.value);
  if (isNaN(v)) return;
  root = deleteNode(root, v);
  drawTree();
  valueInput.value = "";
}

function resetTree() {
  root = null;
  operationText.innerText = "Operation: None";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
