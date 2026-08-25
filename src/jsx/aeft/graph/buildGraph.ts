/*
  Graph is built by running a multi source BFS from the root 
  composition(s).
*/

import { debug } from "../../utils/debugMessage";
import { getRootComps } from "./getRootComps";
import { createNode, getLayerType } from "../utils/createNode";
import { GraphEdge, GraphNode } from "../../../shared/types";
import createEdge from "../utils/createEdge";

let nodes: GraphNode[] = [];
let edges: GraphEdge[] = [];

export const buildGraph = () => {
  let nodes_queue = getRootComps();

  if (!nodes_queue) {
    return null;
  }

  // Create the inital nodes from root composition(s)
  for (let i = 0; i < nodes_queue.length; i++) {
    nodes.push(createNode(nodes_queue[i]));
  }

  while (nodes_queue.length > 0) {
    const item = nodes_queue.shift();

    for (let i = 0; i < item!.numLayers; i++) {
      const layer = item!.layer(i + 1);
      const childNode = createNode(layer);
      nodes.push(childNode);

      // Connect the current node to the child node
      const parent_id =
        String(item instanceof Layer ? getLayerType(item) : item!.typeName) +
        "-" +
        String(item!.id);

      edges.push(createEdge(parent_id, childNode.id));

      // If the child layer is a composition push it to the queue
      if (layer instanceof AVLayer) {
        const source = layer.source;

        if (source instanceof CompItem) {
          nodes_queue.push(source);
        }
      }
    }
  }

  const graph = { nodes, edges };
  return graph;
};
