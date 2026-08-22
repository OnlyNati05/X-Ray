export interface GraphNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  deletable: boolean;
  data: {
    label: string;
  };
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  deletable: boolean;
  reconnectable: boolean;
}
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
