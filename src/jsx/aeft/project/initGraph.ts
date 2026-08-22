import { buildGraph } from "./buildGraph";
import type { GraphNode, GraphEdge, Graph } from "../../../shared/types";

export const initGraph = () => {
  const graph: Graph | null = buildGraph();

  return graph;
};
