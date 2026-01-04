const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

let root = null;
let operationText = document.getElementById("operation");

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

// AVL utility functions
function height(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  return node ? height(node.left) - height(node.right) : 0;
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
  if (balance > 1 && value < node.left.value)
    return rightRotate(node);

  // RR
  if (balance < -1 && value > node.right.value)
    return leftRotate(node);

  // LR
  if (balance > 1 && value > node.left.value) {
    operationText.innerText = "Operation: Left-Right Rotation";
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }

  // RL
  if (balance < -1 && value < node.right.value) {
    operationText.innerText = "Operation: Right-Left Rotation";
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  operationText.innerText = "Operation: Insert";
  return node;
}

// Drawing
function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!root) return;
  calculatePositions(root, canvas.width / 2, 50, canvas.width / 4);
  drawEdges(root);
  drawNodes(root);
}

function calculatePositions(node, x, y, gap) {
  if (!node) return;
  node.x = x;
  node.y = y;
  calculatePositions(node.left, x - gap, y + 80, gap / 2);
  calculatePositions(node.right, x + gap, y + 80, gap / 2);
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
  ctx.strokeStyle = "#333";
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, node.x, node.y);

  drawNodes(node.left);
  drawNodes(node.right);
}

// Controls
function insertValue() {
  const value = parseInt(document.getElementById("valueInput").value);
  if (isNaN(value)) return;
  root = insert(root, value);
  drawTree();
  document.getElementById("valueInput").value = "";
}

function resetTree() {
  root = null;
  operationText.innerText = "Operation: None";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
