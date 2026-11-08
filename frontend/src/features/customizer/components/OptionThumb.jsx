import { useMemo } from "react";
import GarmentCanvas from "./GarmentCanvas.jsx";
import { resolveGarment } from "../engine/configurationResolver.js";

/**
 * Thumbnail of an option = the REAL garment rendered by the shared engine with that option applied
 * (current fabric + other selections), cropped to the area the option's group changes.
 * No separate thumbnail assets to keep in sync.
 */
export default function OptionThumb({ template, selections, groupId, optionId, fabricId, focus }) {
  const nodes = useMemo(
    () => resolveGarment(template, { ...selections, [groupId]: optionId }, { fabricId }).nodes,
    [template, selections, groupId, optionId, fabricId]
  );
  return (
    <div className="relative w-full overflow-hidden bg-[#f1f1ef]" style={{ aspectRatio: `${focus.width} / ${focus.height}` }}>
      <div className="absolute" style={{ width: `${(template.canvas.width / focus.width) * 100}%`, left: `${(-focus.x / focus.width) * 100}%`, top: `${(-focus.y / focus.height) * 100}%` }}>
        <GarmentCanvas canvas={template.canvas} nodes={nodes} className="w-full" />
      </div>
    </div>
  );
}
