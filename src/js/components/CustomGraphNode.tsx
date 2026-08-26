import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { GraphNode } from "../../shared/types";

type CustomGraphNodeType = Node<GraphNode["data"]>;

export default function CustomGraphNode({
  data,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: NodeProps<CustomGraphNodeType>) {
  return (
    <div className="custom-graph-node">
      <Handle type="target" position={targetPosition} />
      <div className="custom-graph-node__name" title={data.label}>
        {data.label}
      </div>
      <div className="custom-graph-node__type">{data.type}</div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}
