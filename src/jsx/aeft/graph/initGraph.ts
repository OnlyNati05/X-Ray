import { buildGraph } from "./buildGraph";
import type { Graph } from "../../../shared/types";

export const initGraph = () => {
  const graph: Graph | null = buildGraph();

  return graph;
};
