import { Panel, useReactFlow } from "@xyflow/react";
import { LayoutDirection } from "../utils/calculateLayout";

type LayoutControlsProps = {
  onLayout: (direction: LayoutDirection) => void;
};

export function LayoutControls({ onLayout }: LayoutControlsProps) {
  const { fitView } = useReactFlow();

  const layoutAndFit = (direction: LayoutDirection) => {
    onLayout(direction);

    requestAnimationFrame(() => {
      fitView({
        padding: 0.2,
        duration: 300,
        interpolate: "smooth",
      });
    });
  };

  return (
    <Panel position="top-right">
      <button onClick={() => fitView({ padding: 0.2, duration: 300 })}>
        fit graph
      </button>

      <button onClick={() => layoutAndFit("TB")}>vertical layout</button>

      <button onClick={() => layoutAndFit("LR")}>horizontal layout</button>
    </Panel>
  );
}
