import "./main.scss";
import { useState, useCallback, useEffect, useMemo } from "react";
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
import {
  LayoutControls,
  type EdgeCurveType,
} from "../components/LayoutControls";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut } from "lucide-react";

const nodeTypes = { customGraphNode: CustomGraphNode };
const customNodeType = "customGraphNode";

type MiniMapHeaderProps = {
  isMiniMapVisible: boolean;
  onToggle: () => void;
};

function MiniMapHeader({ isMiniMapVisible, onToggle }: MiniMapHeaderProps) {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <Panel
      position="bottom-right"
      className={`minimap-header${
        isMiniMapVisible ? "" : " minimap-header--closed"
      }`}
      style={
        isMiniMapVisible
          ? { width: 160, marginRight: 12, marginBottom: 112 }
          : { width: 32, marginRight: 12, marginBottom: 12 }
      }
    >
      {isMiniMapVisible && (
        <div className="minimap-zoom-controls">
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
        </div>
      )}
      <button
        type="button"
        className={`minimap-toggle${
          isMiniMapVisible ? " minimap-toggle--open" : ""
        }`}
        onClick={onToggle}
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
  );
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [hasGraph, setHasGraph] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState(true);
  const [curveType, setCurveType] = useState<EdgeCurveType>("smoothstep");
  const [layoutDirection, setLayoutDirection] =
    useState<LayoutDirection>("TB");
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

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
          setEdges(
            layoutedEdges.map((edge) => ({
              ...edge,
              type: curveType,
            })),
          );
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
      setLayoutDirection(direction);
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

  const nodeDimensions = nodes
    .map(
      (node) =>
        `${node.id}:${node.measured?.width ?? node.width ?? 0}x${
          node.measured?.height ?? node.height ?? 0
        }`,
    )
    .join("|");
  const edgeTopology = edges
    .map((edge) => `${edge.source}->${edge.target}`)
    .join("|");

  useEffect(() => {
    if (!hasGraph || nodes.length === 0) return;

    setNodes((currentNodes) =>
      calculateLayout(currentNodes, edges, layoutDirection).nodes,
    );
  }, [nodeDimensions, edgeTopology, hasGraph, layoutDirection, setNodes]);

  const onCurveTypeChange = useCallback((nextCurveType: EdgeCurveType) => {
    setCurveType(nextCurveType);
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        type: nextCurveType,
      })),
    );
  }, []);

  const areEffectsVisible = nodes.some(
    (node) => node.data.effects.length > 0 && node.data.effectsVisible !== false,
  );

  const onToggleEffects = useCallback(() => {
    const effectsVisible = !areEffectsVisible;

    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          effectsVisible,
        },
      })),
    );
  }, [areEffectsVisible, setNodes]);

  const effectOptions = useMemo(() => {
    const effects = new Set<string>();

    nodes.forEach((node) => {
      node.data.effects.forEach((effect) => effects.add(effect));
    });

    return Array.from(effects).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [nodes]);

  const onEffectFilterToggle = useCallback((effect: string) => {
    setSelectedEffects((currentEffects) =>
      currentEffects.includes(effect)
        ? currentEffects.filter((currentEffect) => currentEffect !== effect)
        : [...currentEffects, effect],
    );
  }, []);

  const filteredNodes = useMemo(() => {
    if (selectedEffects.length === 0) return nodes;

    return nodes.map((node) => ({
      ...node,
      hidden: !selectedEffects.some((effect) =>
        node.data.effects.includes(effect),
      ),
    }));
  }, [nodes, selectedEffects]);

  const filteredEdges = useMemo(() => {
    if (selectedEffects.length === 0) return edges;

    const visibleNodeIds = new Set(
      filteredNodes.filter((node) => !node.hidden).map((node) => node.id),
    );

    return edges.map((edge) => ({
      ...edge,
      hidden:
        !visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target),
    }));
  }, [edges, filteredNodes, selectedEffects]);

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      {error ? (
        <h1>An error occured</h1>
      ) : hasGraph ? (
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
          fitView
          colorMode="system"
          defaultEdgeOptions={{
            type: curveType,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          }}
        >
          <LayoutControls
            curveType={curveType}
            effectOptions={effectOptions}
            effectsVisible={areEffectsVisible}
            onCurveTypeChange={onCurveTypeChange}
            onEffectFilterToggle={onEffectFilterToggle}
            onLayout={onLayout}
            onClearEffectFilters={() => setSelectedEffects([])}
            onToggleEffects={onToggleEffects}
            selectedEffects={selectedEffects}
          />
          {isMiniMapVisible && (
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              style={{
                width: 160,
                height: 100,
                margin: 12,
                borderRadius: "0 0 6px 6px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.09)",
              }}
              bgColor="#4d4d4d"
              nodeColor="#e2e9f7"
            />
          )}
          <MiniMapHeader
            isMiniMapVisible={isMiniMapVisible}
            onToggle={() => setIsMiniMapVisible((visible) => !visible)}
          />

          <Background bgColor="#272727" color="#4d4d4d" />
        </ReactFlow>
      ) : (
        <h1>Please click on an layer in your timeline before opening X-Ray</h1>
      )}
    </div>
  );
}
