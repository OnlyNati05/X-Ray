import { type Node, type NodeProps } from "@xyflow/react";
import type { GraphNode } from "../../shared/types";

type CustomGraphNodeType = Node<GraphNode["data"]>;

export default function CustomGraphNode({
  data,
}: NodeProps<CustomGraphNodeType>) {
  return (
    <div className="custom-graph-node">
      <div className="custom-graph-node__name">{data.label}</div>
      <div className="custom-graph-node__type">{data.type}</div>
    </div>
  );
}
