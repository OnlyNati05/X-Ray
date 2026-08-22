/* This is where Dagre will eventually calculate the 
  layout of the nodes */

import type { GraphNode, GraphEdge } from "../../shared/types";

export default function calculateLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
) {
  const layedOutGraph = { nodes, edges };
  return layedOutGraph;
}
