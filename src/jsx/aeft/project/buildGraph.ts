const dummyNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    deletable: false,
    data: { label: "Comp 1" },
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    deletable: false,
    data: { label: "Node 2" },
  },
];
const dummyEdges = [
  {
    id: "n1-n2",
    deletable: false,
    reconnectable: false,
    source: "n1",
    target: "n2",
  },
];

export const buildGraph = () => {
  const coinFlip = Math.round(Math.random());

  if (coinFlip) {
    return null;
  }

  const graph = { nodes: dummyNodes, edges: dummyEdges };
  return graph;
};
