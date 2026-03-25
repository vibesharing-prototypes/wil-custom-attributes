import type { FC } from "react";
import { Chip, Tooltip } from "@mui/material";
import CaretDownIcon from "@diligentcorp/atlas-react-bundle/icons/CaretDown";
import { STR } from "../../../utils/i18n.js";

interface Props {
  reason?: string;
}

/**
 * Displays a muted "Deprecated" chip.
 * When a deprecation reason is provided, a tooltip on hover surfaces that reason
 * so users understand why the attribute is no longer active.
 */
export const DeprecatedChip: FC<Props> = ({ reason }) => {
  const chip = (
    <Chip
      label={STR.deprecated}
      size="small"
      icon={<CaretDownIcon />}
      aria-label={reason ? `${STR.deprecated}: ${reason}` : STR.deprecated}
      sx={{ height: 18, fontSize: "0.65rem", "& .MuiChip-icon": { fontSize: "0.75rem", marginRight: "-6px" } }}
    />
  );

  if (!reason) return chip;

  return (
    <Tooltip title={reason} placement="top" arrow>
      {/* span needed so Tooltip can attach to a non-interactive element */}
      <span style={{ cursor: "help" }}>{chip}</span>
    </Tooltip>
  );
};
