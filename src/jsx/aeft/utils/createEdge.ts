import { GraphEdge } from "../../../shared/types";

export default function createEdge(
  parent_id: string,
  child_id: string,
): GraphEdge {
  return {
    id: parent_id + child_id,
    deletable: false,
    reconnectable: false,
    source: parent_id,
    target: child_id,
  };
}
