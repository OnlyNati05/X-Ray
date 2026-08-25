import { GraphNode } from "../../../shared/types";
type GraphItem = CompItem | Layer;

export function createNode(item: GraphItem): GraphNode {
  let typeName: string = "";
  if (item instanceof Layer) {
    typeName = getLayerType(item);
  }

  return {
    id:
      String(item instanceof Layer ? typeName : item.typeName) +
      "-" +
      String(item.id),
    position: { x: 0, y: 0 },
    deletable: false,
    data: {
      label: item.name,
      type: String(item instanceof Layer ? typeName : item.typeName),
    },
  };
}

export function getLayerType(layer: Layer) {
  if (layer instanceof TextLayer) return "text";
  if (layer instanceof ShapeLayer) return "shape";
  if (layer instanceof CameraLayer) return "camera";
  if (layer instanceof LightLayer) return "light";

  if (layer instanceof AVLayer) {
    if (layer.adjustmentLayer) return "adjustment";
    if (layer.nullLayer) return "null";
    if (layer.source instanceof CompItem) return "precomp";

    if (
      layer.source instanceof FootageItem &&
      layer.source.mainSource instanceof SolidSource
    ) {
      return "solid";
    }

    return "footage";
  }

  return "Unkown";
}
