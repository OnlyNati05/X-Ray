import { useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
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
  const { setNodes } = useReactFlow<CustomGraphNodeType>();
  const [showAllEffects, setShowAllEffects] = useState(false);
  const nodeInfo = getNodeInfo(data.type);
  const effectsVisible = data.effectsVisible !== false;
  const hasMoreEffects = data.effects.length > 3;
  const visibleEffects = showAllEffects
    ? data.effects
    : data.effects.slice(0, 3);

  return (
    <div
      className="custom-graph-node"
      style={{ backgroundColor: nodeInfo.color }}
    >
      <Handle type="target" position={targetPosition} />
      <div className="custom-graph-node__content">
        <div className="custom-graph-node__name" title={data.label}>
          {data.label}
        </div>
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
        <img
          className="custom-graph-node__blast-icon"
          src={blastRadiusIcon}
          alt=""
        />
      </div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}
