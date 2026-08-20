import "./main.scss";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Test from "../utils/test";
import { evalTS } from "../lib/utils/bolt";
import calculateLayout from "../utils/calculateLayout";
import { GraphNode, GraphEdge } from "../../shared/types";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    deletable: false,
    data: { label: "Comp 1" },
  },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [
  {
    id: "n1-n2",
    deletable: false,
    reconnectable: false,
    source: "n1",
    target: "n2",
  },
];

export default function App() {
  const [nodes, setNodes] = useState<GraphNode[] | null>(null);
  const [edges, setEdges] = useState<GraphEdge[] | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getGraph() {
      try {
        const { nodes, edges } = await evalTS("createGraph");

        setNodes(nodes);
        setEdges(edges);
      } catch (err) {
        console.error("Failed to retrieve graph: ", err);
        setError(true);
      }
    }

    getGraph();
  }, []);

  if (nodes) {
    const { nodes, edges } = calculateLayout(nodes, edges);

    setNodes(nodes);
    setEdges(edges);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      {nodes && <h1>{nodes[1].id}</h1>}
    </div>
  );
}
