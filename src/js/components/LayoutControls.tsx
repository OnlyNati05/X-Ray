import { Panel, useReactFlow } from "@xyflow/react";
import {
  LineDotRightHorizontal,
  Waypoints,
  Network,
  Route,
  Scan,
  Spline,
  type LucideIcon,
} from "lucide-react";
import type { LayoutDirection } from "../utils/calculateLayout";

export type EdgeCurveType = "default" | "straight" | "smoothstep";

type LayoutControlsProps = {
  curveType: EdgeCurveType;
  onCurveTypeChange: (curveType: EdgeCurveType) => void;
  onLayout: (direction: LayoutDirection) => void;
};

const curveOptions: Array<{
  icon: LucideIcon;
  label: string;
  value: EdgeCurveType;
}> = [
  { icon: Spline, label: "Default", value: "default" },
  {
    icon: LineDotRightHorizontal,
    label: "Straight",
    value: "straight",
  },
  { icon: Waypoints, label: "Smooth Step", value: "smoothstep" },
];

export function LayoutControls({
  curveType,
  onCurveTypeChange,
  onLayout,
}: LayoutControlsProps) {
  const { fitView } = useReactFlow();
  const ActiveCurveIcon =
    curveOptions.find((option) => option.value === curveType)?.icon ?? Spline;

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
    <Panel position="bottom-left" className="graph-toolbar">
      <button
        type="button"
        className="graph-toolbar__button"
        onClick={() => fitView({ padding: 0.2, duration: 300 })}
        aria-label="Center"
        data-tooltip="Center"
      >
        <Scan aria-hidden="true" />
      </button>

      <button
        type="button"
        className="graph-toolbar__button"
        onClick={() => layoutAndFit("LR")}
        aria-label="Fit horizontal"
        data-tooltip="Fit Horizontal"
      >
        <Network
          className="graph-toolbar__horizontal-icon"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        className="graph-toolbar__button"
        onClick={() => layoutAndFit("TB")}
        aria-label="Fit vertical"
        data-tooltip="Fit Vertical"
      >
        <Network aria-hidden="true" />
      </button>

      <div className="graph-toolbar__curve-control">
        <div className="graph-toolbar__curve-menu">
          {curveOptions.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              type="button"
              className={`graph-toolbar__button graph-toolbar__curve-option${
                curveType === value
                  ? " graph-toolbar__curve-option--active"
                  : ""
              }`}
              onClick={() => onCurveTypeChange(value)}
              aria-label={label}
              aria-pressed={curveType === value}
              data-tooltip={label}
            >
              <Icon aria-hidden="true" />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="graph-toolbar__button"
          aria-label="Curve type"
        >
          <ActiveCurveIcon aria-hidden="true" />
        </button>
      </div>
    </Panel>
  );
}
