const fs = require('fs');

function readMap() {
  const fileName = 'orbit-map-input.txt';
  const contents = fs.readFileSync(fileName, 'utf8');
  const lines = contents.split(/\n/);
  return lines.map(l => l.split(')'));
}

class Node {
  constructor(name) {
    this.name = name;
    this.orbits = null;
    this.parent = null;
    this.children = [];
  }
}

class Tree {
  constructor(root) {
    root.orbits = 0;
    this.root = root;
  }

  add(node, parentName) {
    const parent = this.findNode(this.root, parentName);
    if(parent) {
      node.parent = parent;
      node.orbits = parent.orbits + 1;
      parent.children.push(node);
    } else {
      throw new Error('parent not found: ' + parentName);
    }
  }

  findNode(currNode, nodeName) {
    if(currNode.name === nodeName) {
      return currNode;
    }
    for(const c of currNode.children) {
      const res = this.findNode(c, nodeName);
      if(res === null) {
        continue;
      } else {
        return res;
      }
    }

    // Not found
    return null;
  }

  countOrbits() {
    this.countOrbits_1(this.root);
    return this.sumOrbit(this.root);
  }

  countOrbits_1(currNode) {
    for(const c of currNode.children) {
      c.orbits = c.parent.orbits + 1;
      this.countOrbits_1(c);
    }
  }

  sumOrbit(currNode) {
    return currNode.orbits + currNode.children.reduce((acc, c) => acc + this.sumOrbit(c), 0);
  }

  getParents(nodeName) {
    let currNode = this.findNode(this.root, nodeName);
    const parents = [];
    while(currNode.parent !== null) {
      parents.push(currNode.parent.name);
      currNode = currNode.parent;
    }
    return parents;
  }
}

function mapToTree(map) {
  const trees = [ new Tree(new Node('COM')) ];

  for(const [center, body] of map) {
    const tree = trees.find(t => t.findNode(t.root, center));
    if(tree) {
      tree.add(new Node(body), center);
    } else {
      const newTree = new Tree(new Node(center));
      newTree.add(new Node(body), center);
      trees.push(newTree);
    }
  }

  while(trees.length > 1) {
    const tree = trees.pop();
    const treeToBeMergedWith = findNodeInTrees(trees, tree.root.name);
    if(treeToBeMergedWith) {
      mergeTrees(treeToBeMergedWith, tree);
      continue;
    }
    // Did not fit in any of the trees
    trees.unshift(tree);
  }
  return trees[0];
}

function findNodeInTrees(trees, nodeName) {
  for(const t of trees) {
    if(t.findNode(t.root, nodeName) !== null) {
      return t;
    }
  }
}

function mergeTrees(t1, t2) {
  try {
    const oldRoot = t2.root;
    for(c of oldRoot.children) {
      t1.add(c, oldRoot.name);
    }
    return t1;
  } catch (error) {
    console.log(t1, t2);
    throw new Error('could not merge trees');
  }
}

function countTransfers(a, b) {
  for(let i = 0; i < a.length; i++) {
    const o = a[i];
    const bIndex = b.indexOf(o);
    if(bIndex === -1) {
      continue;
    } else {
      return i + bIndex;
    }
  }
}

const map = readMap();
const tree = mapToTree(map);
const myParents = tree.getParents('YOU');
const santaParents = tree.getParents('SAN');
console.log(tree.countOrbits());
console.log(countTransfers(myParents, santaParents));
