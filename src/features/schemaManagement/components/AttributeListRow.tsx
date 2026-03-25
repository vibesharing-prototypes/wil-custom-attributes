import { useState, type FC, type MouseEvent } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import type { AttributeDefinition } from "../../../types/attribute.js";
import { TYPE_LABELS, STR } from "../../../utils/i18n.js";
import { getTypeIcon } from "./AttributeTypeSelector.js";
import { DeprecatedChip } from "./DeprecatedChip.js";
import HistoryIcon from "@diligentcorp/atlas-react-bundle/icons/History";
import CaretUpIcon from "@diligentcorp/atlas-react-bundle/icons/CaretUp";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";

interface Props {
  attribute: AttributeDefinition;
  /** If true, no edit/deprecate/history buttons are shown (for OOTB attributes) */
  readonly?: boolean;
  onEdit?: (attribute: AttributeDefinition) => void;
  onDeprecate?: (attribute: AttributeDefinition) => void;
  onReactivate?: (attribute: AttributeDefinition) => void;
  onViewHistory?: (attribute: AttributeDefinition) => void;
}

/**
 * A single row in the schema management list, rendered as an accordion.
 * The summary shows attribute name, type, and a 1-line truncated description.
 * Expanding the row reveals a "Changes" link, the full description, and options.
 * OOTB attributes render with a "Built-in" badge and no write actions.
 */
export const AttributeListRow: FC<Props> = ({
  attribute,
  readonly,
  onEdit,
  onDeprecate,
  onReactivate,
  onViewHistory,
}) => {
  const { name, type, required, lifecycleStatus, deprecationReason, semanticDescription, isOotb, options } =
    attribute;

  const TypeIcon = getTypeIcon(type);
  const isDeprecated = lifecycleStatus === "deprecated";
  const hasOptions = (type === "singleSelect" || type === "multiSelect") && options && options.length > 0;
  const showChangesLink = !readonly && !!onViewHistory;
  const hasExpandableContent = !!semanticDescription || hasOptions || showChangesLink;

  const [expanded, setExpanded] = useState(false);

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <Accordion
      data-atlas-alignment="end"
      disableGutters
      elevation={0}
      expanded={hasExpandableContent ? expanded : false}
      onChange={hasExpandableContent ? (_, isExpanded) => setExpanded(isExpanded) : undefined}
      sx={({ palette }) => ({
        opacity: isDeprecated ? 0.65 : 1,
        "&:before": { display: "none" },
        borderBottom: "1px solid",
        borderColor: palette.divider,
        "&:last-of-type": { borderBottom: "none" },
        "&.Mui-expanded": { margin: 0 },
        ...(!hasExpandableContent && {
          "& .MuiAccordionSummary-expandIconWrapper": { display: "none" },
        }),
        // Override Atlas theme rotation: collapsed = down (0deg), expanded = up (180deg)
        "& .MuiAccordionSummary-expandIconWrapper": { transform: "rotate(0deg)" },
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(180deg)" },
      })}
    >
      <AccordionSummary
        expandIcon={hasExpandableContent ? <ExpandDownIcon /> : undefined}
        aria-controls={hasExpandableContent ? `attr-${attribute.id}-details` : undefined}
        id={`attr-${attribute.id}-header`}
        sx={{
          px: 2,
          minHeight: 0,
          "& .MuiAccordionSummary-content": {
            my: 1.5,
            mr: 1,
            minWidth: 0,
            alignItems: "center",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          sx={{ width: "100%", minWidth: 0 }}
        >
          {/* Left: type icon + name + chips + type label + truncated description */}
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={({ tokens }) => ({
                color:
                  tokens.semantic.color.type?.secondary?.value ??
                  tokens.semantic.color.type?.muted?.value ??
                  "text.secondary",
                display: "flex",
                flexShrink: 0,
              })}
            >
              <TypeIcon aria-hidden />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    textDecoration: isDeprecated ? "line-through" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </Typography>

                {required && (
                  <Chip
                    label={STR.required}
                    size="small"
                    variant="outlined"
                    icon={<CaretUpIcon />}
                    sx={{ height: 18, fontSize: "0.65rem", "& .MuiChip-icon": { fontSize: "0.75rem", marginRight: "-6px" } }}
                  />
                )}

                {isDeprecated && <DeprecatedChip reason={deprecationReason} />}

                {isOotb && (
                  <Chip
                    label={STR.builtIn}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.65rem", borderColor: "divider" }}
                  />
                )}
              </Stack>

              {/* Type label + 1-line truncated description */}
              <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 0.25, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={({ tokens }) => ({
                    color: tokens.semantic.color.type?.muted?.value ?? "text.secondary",
                    flexShrink: 0,
                  })}
                >
                  {TYPE_LABELS[type]}
                </Typography>
                {semanticDescription && (
                  <Box sx={{ display: "contents" }}>
                    <Typography
                      aria-hidden="true"
                      variant="caption"
                      sx={({ tokens }) => ({
                        color: tokens.semantic.color.type?.muted?.value ?? "text.secondary",
                        flexShrink: 0,
                        opacity: expanded ? 0 : 1,
                        transition: "opacity 0.2s ease",
                      })}
                    >
                      ·
                    </Typography>
                    <Typography
                      variant="caption"
                      aria-hidden={expanded}
                      sx={({ tokens }) => ({
                        color: tokens.semantic.color.type?.muted?.value ?? "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                        opacity: expanded ? 0 : 1,
                        transition: "opacity 0.2s ease",
                      })}
                    >
                      {semanticDescription}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Right: action buttons — stopPropagation prevents accordion toggle on click */}
          {!readonly && (
            <Stack
              direction="row"
              gap={0.5}
              flexShrink={0}
              onClick={stopPropagation}
            >
              {!isDeprecated && onEdit && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => onEdit(attribute)}
                  aria-label={`Edit attribute "${name}"`}
                >
                  {STR.schemaManagement.editAttribute}
                </Button>
              )}

              {!isDeprecated && onDeprecate && (
                <Button
                  variant="text"
                  size="small"
                  color="warning"
                  onClick={() => onDeprecate(attribute)}
                  aria-label={`Deprecate attribute "${name}"`}
                >
                  {STR.schemaManagement.deprecateAttribute}
                </Button>
              )}

              {isDeprecated && onReactivate && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => onReactivate(attribute)}
                  aria-label={`Reactivate attribute "${name}"`}
                >
                  {STR.schemaManagement.reactivateAttribute}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </AccordionSummary>

      {hasExpandableContent && (
        <AccordionDetails
          id={`attr-${attribute.id}-details`}
          sx={{ px: 2, pt: 0, pb: 2 }}
        >
          <Stack gap={1.5}>
            {/* Changes link — shown first, before description */}
            {showChangesLink && (
              <Box>
                <Link
                  component="button"
                  underline="always"
                  onClick={() => onViewHistory!(attribute)}
                  aria-label={`View change history for "${name}"`}
                  sx={{
                    fontSize: "0.75rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                  }}
                >
                  <HistoryIcon aria-hidden sx={{ fontSize: "0.9rem" }} />
                  {STR.auditLog.changesButton}
                </Link>
              </Box>
            )}

            {semanticDescription && (
              <Box>
                <Typography
                  sx={({ tokens }) => ({
                    fontFamily: tokens.semantic.font.label.sm.fontFamily,
                    fontSize: tokens.semantic.font.label.sm.fontSize,
                    fontWeight: tokens.semantic.fontWeight.emphasis,
                    letterSpacing: tokens.semantic.font.label.sm.letterSpacing,
                    lineHeight: tokens.semantic.font.label.sm.lineHeight,
                    textTransform: tokens.semantic.font.label.sm.textTransform,
                    color: tokens.semantic.color.type?.muted?.value ?? "text.secondary",
                    display: "block",
                    mb: 0.75,
                  })}
                >
                  {STR.form.descriptionLabel}
                </Typography>
                <Typography
                  variant="body2"
                  sx={({ tokens }) => ({ color: tokens.semantic.color.type?.muted?.value ?? "text.secondary" })}
                >
                  {semanticDescription}
                </Typography>
              </Box>
            )}

            {hasOptions && (
              <Box>
                <Typography
                  sx={({ tokens }) => ({
                    fontFamily: tokens.semantic.font.label.sm.fontFamily,
                    fontSize: tokens.semantic.font.label.sm.fontSize,
                    fontWeight: tokens.semantic.fontWeight.emphasis,
                    letterSpacing: tokens.semantic.font.label.sm.letterSpacing,
                    lineHeight: tokens.semantic.font.label.sm.lineHeight,
                    textTransform: tokens.semantic.font.label.sm.textTransform,
                    color: tokens.semantic.color.type?.muted?.value ?? "text.secondary",
                    display: "block",
                    mb: 0.75,
                  })}
                >
                  Options
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {options!.map((opt) => (
                    <Chip
                      key={opt.id}
                      label={opt.label}
                      size="small"
                      variant="outlined"
                      sx={
                        opt.deprecated
                          ? { textDecoration: "line-through", opacity: 0.5 }
                          : undefined
                      }
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      )}
    </Accordion>
  );
};
