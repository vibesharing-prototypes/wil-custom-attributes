import type { FC } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { AttributeDefinition } from "../../../types/attribute.js";
import { STR } from "../../../utils/i18n.js";
import { AttributeListRow } from "./AttributeListRow.js";
import AddIcon from "@diligentcorp/atlas-react-bundle/icons/Add";
import HistoryIcon from "@diligentcorp/atlas-react-bundle/icons/History";

interface Props {
  attributes: AttributeDefinition[];
  onAdd: () => void;
  onEdit: (attribute: AttributeDefinition) => void;
  onDeprecate: (attribute: AttributeDefinition) => void;
  onReactivate: (attribute: AttributeDefinition) => void;
  onViewAuditLog: () => void;
  onViewAttributeHistory: (attribute: AttributeDefinition) => void;
}

/**
 * The custom attributes section in the schema management view.
 * Displays a section header with "Add attribute" action and the list of custom attributes.
 * Empty state is shown when no custom attributes exist yet.
 *
 * M3 grouped-sections readiness:
 * When sections land (M3), this component will need to render multiple named groups rather
 * than a single flat list. The recommended extension: accept an optional `sections` prop
 * (from `ObjectSchema.sections`) and render one `AttributeManagementList` per section,
 * or refactor into a `SchemaSection` component that wraps `AttributeListRow` items.
 * The current architecture (flat list + `AttributeListRow` as self-contained rows)
 * is compatible with this extension — no structural changes to rows are required.
 */
export const AttributeManagementList: FC<Props> = ({
  attributes,
  onAdd,
  onEdit,
  onDeprecate,
  onReactivate,
  onViewAuditLog,
  onViewAttributeHistory,
}) => {
  return (
    <Box>
      {/* Section heading row */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: 600 }}
          >
            {STR.schemaManagement.customSectionTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={({ tokens }) => ({ color: tokens.semantic.color.type?.default?.value ?? "text.primary", mt: 0.5 })}
          >
            {STR.schemaManagement.customSectionSubtitle}
          </Typography>
        </Box>
        <Stack direction="row" gap={1} flexShrink={0}>
          <Button
            variant="text"
            startIcon={<HistoryIcon aria-hidden />}
            onClick={onViewAuditLog}
            aria-label={STR.auditLog.globalTitle}
          >
            {STR.auditLog.auditLogButton}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon aria-hidden />}
            onClick={onAdd}
            aria-label={STR.schemaManagement.addAttribute}
          >
            {STR.schemaManagement.addAttribute}
          </Button>
        </Stack>
      </Stack>
      {attributes.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={({ tokens }) => ({ color: tokens.semantic.color.type?.muted?.value ?? "text.secondary" })}
          >
            {STR.schemaManagement.emptyState}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflow: "hidden" }}>
          {attributes.map((attr) => (
            <AttributeListRow
              key={attr.id}
              attribute={attr}
              onEdit={onEdit}
              onDeprecate={onDeprecate}
              onReactivate={onReactivate}
              onViewHistory={onViewAttributeHistory}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
