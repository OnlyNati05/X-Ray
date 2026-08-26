import "./main.scss";
import { useState, useCallback, useEffect } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  Connection,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { evalTS } from "../lib/utils/bolt";
import calculateLayout, {
  type LayoutDirection,
} from "../utils/calculateLayout";
import type { GraphNode, GraphEdge, Graph } from "../../shared/types";
import CustomGraphNode from "../components/CustomGraphNode";
import { LayoutControls } from "../components/LayoutControls";

const nodeTypes = { customGraphNode: CustomGraphNode };
const customNodeType = "customGraphNode";

function FitViewButton() {
  const { fitView } = useReactFlow();

  return (
    <button
      className="xy-theme__button"
      onClick={() =>
        fitView({ padding: 0.2, duration: 300, interpolate: "smooth" })
      }
    >
      fit graph
    </button>
  );
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [hasGraph, setHasGraph] = useState(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getGraph() {
      try {
        const graph: Graph | null = await evalTS("initGraph");

        if (graph) {
          const { nodes: layoutedNodes, edges: layoutedEdges } =
            calculateLayout(graph.nodes, graph.edges, "TB");

          setNodes(
            layoutedNodes.map((node) => ({
              ...node,
              type: customNodeType,
            })),
          );
          setEdges(layoutedEdges);
          setHasGraph(true);
        }
      } catch (err) {
        console.error("Failed to retrieve graph: ", err);
        setError(true);
      }
    }

    getGraph();
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  const onLayout = useCallback(
    (direction: LayoutDirection) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = calculateLayout(
        nodes,
        edges,
        direction,
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      {error ? (
        <h1>An error occured</h1>
      ) : hasGraph ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          fitView
          colorMode="system"
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          }}
        >
          <LayoutControls onLayout={onLayout} />
          <Background bgColor="#272727" color="#4d4d4d" />
        </ReactFlow>
      ) : (
        <h1>Please click on an layer in your timeline before opening X-Ray</h1>
      )}
    </div>
  );
}
