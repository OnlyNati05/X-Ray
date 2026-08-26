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
  useViewport,
  MarkerType,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { evalTS } from "../lib/utils/bolt";
import calculateLayout, {
  type LayoutDirection,
} from "../utils/calculateLayout";
import type { GraphNode, GraphEdge, Graph } from "../../shared/types";
import CustomGraphNode from "../components/CustomGraphNode";
import { LayoutControls } from "../components/LayoutControls";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut } from "lucide-react";

const nodeTypes = { customGraphNode: CustomGraphNode };
const customNodeType = "customGraphNode";

function MiniMapZoomControls() {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <Panel
      position="bottom-right"
      className="minimap-zoom-panel"
      style={{ marginRight: 68, marginBottom: 108 }}
    >
      <button
        type="button"
        className="minimap-zoom-button"
        onClick={() => zoomOut({ duration: 200 })}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut aria-hidden="true" />
      </button>
      <span className="minimap-zoom-percentage">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        className="minimap-zoom-button"
        onClick={() => zoomIn({ duration: 200 })}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn aria-hidden="true" />
      </button>
    </Panel>
  );
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [hasGraph, setHasGraph] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState(true);

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
          {isMiniMapVisible && (
            <>
              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
                style={{ width: 180, height: 130, margin: 12 }}
                bgColor="#4d4d4d"
                nodeColor="#e2e9f7"
              />
              <MiniMapZoomControls />
            </>
          )}
          <Panel
            position="bottom-right"
            className="minimap-toggle-panel"
            style={
              isMiniMapVisible
                ? { marginRight: 18, marginBottom: 108 }
                : { marginRight: 12, marginBottom: 12 }
            }
          >
            <button
              type="button"
              className={`minimap-toggle${
                isMiniMapVisible ? " minimap-toggle--open" : ""
              }`}
              onClick={() => setIsMiniMapVisible((visible) => !visible)}
              aria-label={isMiniMapVisible ? "Hide minimap" : "Show minimap"}
              title={isMiniMapVisible ? "Hide minimap" : "Show minimap"}
            >
              {isMiniMapVisible ? (
                <ChevronDown aria-hidden="true" />
              ) : (
                <ChevronUp aria-hidden="true" />
              )}
            </button>
          </Panel>

          <Background bgColor="#272727" color="#4d4d4d" />
        </ReactFlow>
      ) : (
        <h1>Please click on an layer in your timeline before opening X-Ray</h1>
      )}
    </div>
  );
}
