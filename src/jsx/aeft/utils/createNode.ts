import { GraphNode } from "../../../shared/types";
type GraphItem = CompItem | Layer;

export function createNode(item: GraphItem): GraphNode {
  const typeName =
    item instanceof CompItem ? item.typeName : getLayerType(item as Layer);

  return {
    id: typeName + "-" + String(item.id),
    position: { x: 0, y: 0 },
    deletable: false,
    data: {
      label: item.name,
      type: typeName,
    },
  };
}

export function getLayerType(layer: Layer) {
  if (layer instanceof TextLayer) return "Text";
  if (layer instanceof ShapeLayer) return "Shape";
  if (layer instanceof CameraLayer) return "Camera";
  if (layer instanceof LightLayer) return "Light";

  if (layer instanceof AVLayer) {
    if (layer.adjustmentLayer) return "Adjustment";
    if (layer.nullLayer) return "Null";
    if (layer.source instanceof CompItem) return "Precomp";

    if (
      layer.source instanceof FootageItem &&
      layer.source.mainSource instanceof SolidSource
    ) {
      return "Solid";
    }

    return "Footage";
  }

  return "Unknown";
}
