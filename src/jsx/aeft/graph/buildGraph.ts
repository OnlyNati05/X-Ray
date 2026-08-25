/*
  Graph is built by running a multi source BFS from the root 
  composition(s).
*/

import { debug } from "../../utils/debugMessage";
import { getRootComps } from "./getRootComps";
import { createNode, getLayerType } from "../utils/createNode";
import { GraphEdge, GraphNode } from "../../../shared/types";
import createEdge from "../utils/createEdge";

type QueueEntry = {
  comp: CompItem;
  graphNodeId: string;
};

export const buildGraph = () => {
  const roots = getRootComps();

  if (!roots) {
    return null;
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const queue: QueueEntry[] = [];

  for (let i = 0; i < roots.length; i++) {
    const rootNode = createNode(roots[i]);

    nodes.push(rootNode);
    queue.push({
      comp: roots[i],
      graphNodeId: rootNode.id,
    });
  }

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (let i = 1; i <= current.comp.numLayers; i++) {
      const layer = current.comp.layer(i);
      const childNode = createNode(layer);

      nodes.push(childNode);
      edges.push(createEdge(current.graphNodeId, childNode.id));

      if (layer instanceof AVLayer && layer.source instanceof CompItem) {
        queue.push({
          comp: layer.source,
          graphNodeId: childNode.id,
        });
      }
    }
  }

  return { nodes, edges };
};
