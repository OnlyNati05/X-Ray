/* This is where Dagre calculates the 
  layout of the nodes */

import dagre from "@dagrejs/dagre";
import { Position } from "@xyflow/react";
import type { GraphNode, GraphEdge } from "../../shared/types";

export type LayoutDirection = "TB" | "LR";

const defaultNodeWidth = 172;
const defaultNodeHeight = 72;

function getNodeDimensions(node: GraphNode) {
  return {
    width: node.measured?.width ?? node.width ?? defaultNodeWidth,
    height: node.measured?.height ?? node.height ?? defaultNodeHeight,
  };
}

export default function calculateLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  direction: LayoutDirection,
) {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, rankSep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, getNodeDimensions(node));
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { width, height } = getNodeDimensions(node);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // Shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
}
