import { Panel, useReactFlow } from "@xyflow/react";
import {
  LineDotRightHorizontal,
  Waypoints,
  Network,
  Scan,
  Spline,
  Funnel,
  type LucideIcon,
} from "lucide-react";
import type { LayoutDirection } from "../utils/calculateLayout";
import fxIcon from "../assets/fx-sign-white.png";

export type EdgeCurveType = "default" | "straight" | "smoothstep";

type LayoutControlsProps = {
  curveType: EdgeCurveType;
  effectOptions: string[];
  effectsVisible: boolean;
  onCurveTypeChange: (curveType: EdgeCurveType) => void;
  onEffectFilterToggle: (effect: string) => void;
  onLayout: (direction: LayoutDirection) => void;
  onClearEffectFilters: () => void;
  onToggleEffects: () => void;
  selectedEffects: string[];
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

const curveIcons: Record<EdgeCurveType, LucideIcon> = {
  default: Spline,
  straight: LineDotRightHorizontal,
  smoothstep: Waypoints,
};

export function LayoutControls({
  curveType,
  effectOptions,
  effectsVisible,
  onCurveTypeChange,
  onEffectFilterToggle,
  onLayout,
  onClearEffectFilters,
  onToggleEffects,
  selectedEffects,
}: LayoutControlsProps) {
  const { fitView } = useReactFlow();
  const ActiveCurveIcon = curveIcons[curveType];

  const layoutAndFit = (direction: LayoutDirection) => {
    onLayout(direction);

    /* 
      fitView() needs to run on the next frame because onLayout() changes the state 
      of the nodes and edges. Since state updates are queued to happen 
      after the function finishes execution, fitView() would be operating 
      on stale/old state.
    */
    requestAnimationFrame(() => {
      fitView({
        padding: 0.2,
        duration: 600,
        interpolate: "smooth",
      });
    });
  };

  return (
    <Panel position="bottom-left" className="graph-toolbar">
      <button
        type="button"
        className="graph-toolbar__button"
        onClick={() => fitView({ padding: 0.2, duration: 600 })}
        aria-label="Center"
        data-tooltip="Center"
      >
        <Scan aria-hidden="true" />
      </button>

      <button
        type="button"
        className="graph-toolbar__button graph-toolbar__effects-button"
        onClick={onToggleEffects}
        aria-label={effectsVisible ? "Hide all effects" : "Show all effects"}
        aria-pressed={effectsVisible}
        data-tooltip={effectsVisible ? "Hide Effects" : "Show Effects"}
      >
        <img src={fxIcon} alt="" />
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

      <div className="graph-toolbar__filter-control">
        <div className="graph-toolbar__filter-menu">
          <div className="graph-toolbar__filter-title">Filter by effect</div>
          <div className="graph-toolbar__filter-options">
            {effectOptions.length > 0 ? (
              effectOptions.map((effect) => {
                const isSelected = selectedEffects.includes(effect);

                return (
                  <button
                    key={effect}
                    type="button"
                    className={`graph-toolbar__filter-option${
                      isSelected
                        ? " graph-toolbar__filter-option--selected"
                        : ""
                    }`}
                    onClick={() => onEffectFilterToggle(effect)}
                    aria-pressed={isSelected}
                    title={effect}
                  >
                    {effect}
                  </button>
                );
              })
            ) : (
              <div className="graph-toolbar__filter-empty">No effects found</div>
            )}
          </div>
          <button
            type="button"
            className="graph-toolbar__filter-clear"
            onClick={onClearEffectFilters}
            disabled={selectedEffects.length === 0}
          >
            Clear filters
          </button>
        </div>

        <button
          type="button"
          className="graph-toolbar__button graph-toolbar__filter-button"
          aria-label="Filter nodes by effect"
          aria-pressed={selectedEffects.length > 0}
        >
          <Funnel aria-hidden="true" />
          {selectedEffects.length > 0 && (
            <span className="graph-toolbar__filter-count">
              {selectedEffects.length}
            </span>
          )}
        </button>
      </div>
    </Panel>
  );
}
