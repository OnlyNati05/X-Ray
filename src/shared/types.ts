export interface GraphNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  deletable: boolean;
  width?: number;
  height?: number;
  measured?: {
    width?: number;
    height?: number;
  };
  hidden?: boolean;
  data: {
    label: string;
    type: string;
    depth: number;
    effects: string[];
    effectsVisible?: boolean;
    blastRadiusHighlighted?: boolean;
    blastRadiusSource?: boolean;
  };
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  deletable: boolean;
  reconnectable: boolean;
  type: string;
}
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
