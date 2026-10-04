import { useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type { GraphNode } from "../../shared/types";
import blastRadiusIcon from "../assets/blast-radius.png";
import compositionIcon from "../assets/composition.png";
import fxIcon from "../assets/fx-sign-white.png";
import layerIcon from "../assets/layer.png";
import videoIcon from "../assets/video.png";

type CustomGraphNodeType = Node<GraphNode["data"]>;

function findAncestorCompositionIds(
  startNodeId: string,
  nodes: CustomGraphNodeType[],
  edges: Edge[],
) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const parentIdsByChildId = new Map<string, string[]>();

  edges.forEach((edge) => {
    const parentIds = parentIdsByChildId.get(edge.target) ?? [];
    parentIds.push(edge.source);
    parentIdsByChildId.set(edge.target, parentIds);
  });

  const compositionIds = new Set<string>();
  const visited = new Set<string>([startNodeId]);
  const pending = [startNodeId];

  while (pending.length > 0) {
    const currentNodeId = pending.pop()!;
    const parentIds = parentIdsByChildId.get(currentNodeId) ?? [];

    parentIds.forEach((parentId) => {
      if (visited.has(parentId)) return;

      visited.add(parentId);
      pending.push(parentId);

      const parentNode = nodesById.get(parentId);
      if (
        parentNode?.data.type === "Composition" ||
        parentNode?.data.type === "Precomp"
      ) {
        compositionIds.add(parentId);
      }
    });
  }

  return compositionIds;
}

function getNodeInfo(type: string) {
  if (type === "Precomp" || type === "Composition") {
    return { image: compositionIcon, color: "#847455" };
  }

  if (type === "Footage") {
    return { image: videoIcon, color: "#548b85" };
  }

  return { image: layerIcon, color: "#A03131" };
}

export default function CustomGraphNode({
  id,
  data,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: NodeProps<CustomGraphNodeType>) {
  const { getEdges, setNodes } = useReactFlow<CustomGraphNodeType>();
  const [showAllEffects, setShowAllEffects] = useState(false);
  const nodeInfo = getNodeInfo(data.type);
  const effectsVisible = data.effectsVisible !== false;
  const hasMoreEffects = data.effects.length > 3;
  const visibleEffects = showAllEffects
    ? data.effects
    : data.effects.slice(0, 3);

  return (
    <div
      className={`custom-graph-node${
        data.blastRadiusHighlighted
          ? " custom-graph-node--blast-highlighted"
          : ""
      }`}
      data-node-name={data.label}
      style={{ backgroundColor: nodeInfo.color }}
    >
      <Handle type="target" position={targetPosition} />
      <div className="custom-graph-node__content">
        <div className="custom-graph-node__name">{data.label}</div>
        <div className="custom-graph-node__type">{data.type}</div>
        <div className="custom-graph-node__type">Depth: {data.depth}</div>
        {effectsVisible && visibleEffects.length > 0 && (
          <div className="custom-graph-node__effects">
            <h3>Effects: </h3>
            <ul>
              {visibleEffects.map((effect, index) => (
                <li key={`${effect}-${index}`} title={effect}>
                  {effect}
                </li>
              ))}
            </ul>
            {hasMoreEffects && (
              <button
                type="button"
                className="custom-graph-node__effects-toggle nodrag nopan"
                aria-expanded={showAllEffects}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllEffects((isShowingAll) => !isShowingAll);
                }}
                onPointerDown={(event) => event.stopPropagation()}
              >
                {showAllEffects ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="custom-graph-node__icons">
        <img src={nodeInfo.image} alt="" />
        <button
          type="button"
          className={`custom-graph-node__icon-button nodrag nopan${
            effectsVisible
              ? ""
              : " custom-graph-node__icon-button--effects-hidden"
          }`}
          aria-label={effectsVisible ? "Hide effects" : "Show effects"}
          aria-pressed={effectsVisible}
          onClick={(event) => {
            event.stopPropagation();
            setNodes((currentNodes) =>
              currentNodes.map((node) =>
                node.id === id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        effectsVisible: !effectsVisible,
                      },
                    }
                  : node,
              ),
            );
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <img src={fxIcon} alt="" />
        </button>
        <button
          type="button"
          className={`custom-graph-node__icon-button custom-graph-node__blast-button nodrag nopan`}
          aria-label={
            data.blastRadiusSource ? "Clear blast radius" : "Show blast radius"
          }
          aria-pressed={data.blastRadiusSource === true}
          onClick={(event) => {
            event.stopPropagation();
            const shouldClear = data.blastRadiusSource === true;
            const edges = getEdges();

            setNodes((currentNodes) => {
              const compositionIds = shouldClear
                ? new Set<string>()
                : findAncestorCompositionIds(id, currentNodes, edges);

              return currentNodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  blastRadiusHighlighted: compositionIds.has(node.id),
                  blastRadiusSource: !shouldClear && node.id === id,
                },
              }));
            });
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <img src={blastRadiusIcon} alt="" />
        </button>
      </div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}
