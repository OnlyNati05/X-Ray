import "./main.scss";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { evalTS } from "../lib/utils/bolt";
import calculateLayout from "../utils/calculateLayout";
import type { GraphNode, GraphEdge, Graph } from "../../shared/types";

export default function App() {
  const [nodes, setNodes] = useState<GraphNode[] | null>(null);
  const [edges, setEdges] = useState<GraphEdge[] | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getGraph() {
      try {
        const graph: Graph | null = await evalTS("initGraph");

        if (graph) {
          const { nodes, edges } = calculateLayout(graph.nodes, graph.edges);

          setNodes(nodes);
          setEdges(edges);
        }
      } catch (err) {
        console.error("Failed to retrieve graph: ", err);
        setError(true);
      }
    }

    getGraph();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      {error ? (
        <h1>An error occured</h1>
      ) : nodes ? (
        <>
          <h1>{nodes[0].data.label}</h1>
        </>
      ) : (
        <h1>Please click on an layer in your timeline before opening X-Ray</h1>
      )}
    </div>
  );
}
