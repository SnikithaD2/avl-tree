const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");
const operationText = document.getElementById("operation");

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

/* AVL LOGIC */
function height(n) {
  return n ? n.height : 0;
}

function rotateLeft(x) {
  operationText.innerText = "Operation: Left Rotation";
  const y = x.right;
  x.right = y.left;
  y.left = x;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function rotateRight(y) {
  operationText.innerText = "Operation: Right Rotation";
  const x = y.left;
  y.left = x.right;
  x.right = y;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function updateHeight(n) {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

function getBalance(n) {
  return n ? height(n.left) - height(n.right) : 0;
}

function insert(node, value) {
  if (!node) return new Node(value);

  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  else return node;

  updateHeight(node);
  const balance = getBalance(node);

  if (balance > 1 && value < node.left.value) return rotateRight(node);
  if (balance < -1 && value > node.right.value) return rotateLeft(node);

  return node;
}

/* DRAWING */
function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!root) return;

  setPositions(root, canvas.width / 2, 50, canvas.width / 4);
  drawNode(root);
}

function setPositions(node, x, y, gap) {
  node.x = x;
  node.y = y;
  if (node.left) setPositions(node.left, x - gap, y + 80, gap / 2);
  if (node.right) setPositions(node.right, x + gap, y + 80, gap / 2);
}

function drawNode(node) {
  if (node.left) drawLine(node, node.left);
  if (node.right) drawLine(node, node.right);

  ctx.beginPath();
  ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#6fb35f";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.value, node.x, node.y);

  if (node.left) drawNode(node.left);
  if (node.right) drawNode(node.right);
}

function drawLine(p, c) {
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(c.x, c.y);
  ctx.stroke();
}

/* BUTTONS */
document.getElementById("insertBtn").onclick = () => {
  const val = parseInt(document.getElementById("valueInput").value);
  if (!isNaN(val)) {
    root = insert(root, val);
    drawTree();
  }
};

document.getElementById("resetBtn").onclick = () => {
  root = null;
  operationText.innerText = "Operation: Reset";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
