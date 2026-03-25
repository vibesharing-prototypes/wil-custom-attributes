import type { FC } from "react";
import { useCallback, useState } from "react";
import { Alert, Box, Link, Snackbar, Stack, Typography } from "@mui/material";
import type { AttributeDefinition, AttributeType, ObjectSchema } from "../../types/attribute.js";
import type { AuditLogEntry } from "./types.js";
import { STR } from "../../utils/i18n.js";
import { useSchemaManagement } from "./hooks/useSchemaManagement.js";
import { AttributeManagementList } from "./components/AttributeManagementList.js";
import { AttributeFormSheet } from "./components/AttributeFormSheet.js";
import { AuditLogDrawer } from "./components/AuditLogDrawer.js";
import { DeprecationDialog } from "./components/DeprecationDialog.js";
import { AttributeListRow } from "./components/AttributeListRow.js";
import type { FormSheetMode } from "./types.js";

interface Props {
  schema: ObjectSchema;
  /** Starting set of custom attributes — can be empty for a clean M1 prototype */
  initialCustomAttributes?: AttributeDefinition[];
  /**
   * Pre-seeded audit entries for the initial custom attributes (e.g. "created" events
   * that would have been recorded by the backend when those attributes were first defined).
   */
  initialAuditEntries?: AuditLogEntry[];
  /**
   * When provided, restricts the attribute type selector to these types.
   * Used by the BOS-constrained variant to surface only supported types.
   */
  allowedTypes?: AttributeType[];
}

/**
 * The full M1 schema management surface.
 *
 * Layout:
 *   1. Base schema section — OOTB attributes, read-only
 *   2. Custom attributes section — AttributeManagementList with full CRUD
 *   3. Side sheet — progressive disclosure form for create/edit
 *   4. Deprecation dialog — confirmation before deprecating
 *   5. Audit log drawer — global or per-attribute change history
 *   6. Toast — success/error feedback with a direct link to per-attribute history
 *
 * Permission note: in the prototype, access is unrestricted.
 * In production, this view is gated behind manage_schema:{object_type}.
 */
export const SchemaManagementView: FC<Props> = ({ schema, initialCustomAttributes = [], initialAuditEntries = [], allowedTypes }) => {
  const {
    customAttributes,
    auditLog,
    toast,
    hideToast,
    addAttribute,
    updateAttribute,
    deprecateAttribute,
    reactivateAttribute,
  } = useSchemaManagement(initialCustomAttributes, initialAuditEntries);

  const [sheetMode, setSheetMode] = useState<FormSheetMode>(null);
  const [editingAttribute, setEditingAttribute] = useState<AttributeDefinition | null>(null);
  const [deprecatingAttribute, setDeprecatingAttribute] = useState<AttributeDefinition | null>(null);

  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const [auditLogAttributeId, setAuditLogAttributeId] = useState<string | null>(null);

  const ootbAttributes = schema.attributes.filter((a) => a.isOotb);

  const openGlobalAuditLog = useCallback(() => {
    setAuditLogAttributeId(null);
    setAuditLogOpen(true);
  }, []);

  const openAttributeAuditLog = useCallback((attributeId: string, _attributeName?: string) => {
    setAuditLogAttributeId(attributeId);
    setAuditLogOpen(true);
  }, []);

  const closeAuditLog = useCallback(() => {
    setAuditLogOpen(false);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingAttribute(null);
    setSheetMode("create");
  }, []);

  const handleEdit = useCallback((attr: AttributeDefinition) => {
    setEditingAttribute(attr);
    setSheetMode("edit");
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetMode(null);
    setEditingAttribute(null);
  }, []);

  const handleSave = useCallback(
    (def: Omit<AttributeDefinition, "id"> & { id?: string }) => {
      if (def.id) {
        const oldAttr = customAttributes.find((a) => a.id === def.id);
        updateAttribute(def.id, def, oldAttr);
      } else {
        addAttribute(def);
      }
    },
    [addAttribute, updateAttribute, customAttributes],
  );

  const handleDeprecate = useCallback((attr: AttributeDefinition) => {
    setDeprecatingAttribute(attr);
  }, []);

  const handleDeprecateConfirm = useCallback(
    (id: string, reason?: string) => {
      deprecateAttribute(id, reason, deprecatingAttribute?.name);
      setDeprecatingAttribute(null);
    },
    [deprecateAttribute, deprecatingAttribute],
  );

  const handleReactivate = useCallback(
    (attr: AttributeDefinition) => {
      reactivateAttribute(attr.id, attr.name);
    },
    [reactivateAttribute],
  );

  const handleViewHistory = useCallback(
    (attr: AttributeDefinition) => {
      openAttributeAuditLog(attr.id);
    },
    [openAttributeAuditLog],
  );

  const auditLogAttribute = auditLogAttributeId
    ? customAttributes.find((a) => a.id === auditLogAttributeId)
    : null;

  /** The most recent audit entry for the attribute currently open in the edit sheet. */
  const editingLastModified = editingAttribute
    ? [...auditLog].reverse().find((e) => e.attributeId === editingAttribute.id) ?? null
    : null;

  return (
    <Stack gap={4}>
      {/* ── OOTB / Base schema ── */}
      <Box>
        <Typography
          variant="h2"
          sx={{ fontWeight: 600 }}
        >
          {STR.schemaManagement.ootbSectionTitle}
        </Typography>
        <Typography
          variant="body2"
          sx={({ tokens }) => ({ color: tokens.semantic.color.type?.default?.value ?? "text.primary", mt: 0.5, mb: 2 })}
        >
          {STR.schemaManagement.ootbSectionSubtitle}
        </Typography>
        {ootbAttributes.length > 0 && (
          <Box
            sx={{
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {ootbAttributes.map((attr) => (
              <AttributeListRow key={attr.id} attribute={attr} readonly />
            ))}
          </Box>
        )}
        {ootbAttributes.length === 0 && (
          <Typography
            variant="body2"
            sx={({ tokens }) => ({ color: tokens.semantic.color.type?.muted?.value ?? "text.secondary" })}
          >
            No base attributes defined for this object type.
          </Typography>
        )}
      </Box>

      {/* ── Custom attributes ── */}
      <AttributeManagementList
        attributes={customAttributes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDeprecate={handleDeprecate}
        onReactivate={handleReactivate}
        onViewAuditLog={openGlobalAuditLog}
        onViewAttributeHistory={handleViewHistory}
      />

      {/* ── Side sheet ── */}
      <AttributeFormSheet
        mode={sheetMode}
        editingAttribute={editingAttribute}
        onSave={handleSave}
        onClose={handleSheetClose}
        allowedTypes={allowedTypes}
        existingAttributes={customAttributes}
        lastModifiedEntry={editingLastModified}
        onViewHistory={
          editingAttribute
            ? () => openAttributeAuditLog(editingAttribute.id)
            : undefined
        }
      />

      {/* ── Deprecation dialog ── */}
      <DeprecationDialog
        attribute={deprecatingAttribute}
        onConfirm={handleDeprecateConfirm}
        onClose={() => setDeprecatingAttribute(null)}
      />

      {/* ── Audit log drawer ── */}
      <AuditLogDrawer
        open={auditLogOpen}
        entries={auditLog}
        attributeId={auditLogAttributeId}
        attributeName={auditLogAttribute?.name}
        onClose={closeAuditLog}
        onViewFullLog={openGlobalAuditLog}
        onSelectAttribute={openAttributeAuditLog}
      />

      {/* ── Toast notifications ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.severity === "error" ? null : 5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "88px !important", right: "24px !important" }}
      >
        <Alert severity={toast.severity} aria-live="polite" onClose={hideToast}>
          {toast.message}
          {toast.attributeId && (
            <>
              {" "}
              <Link
                component="button"
                underline="always"
                onClick={() => {
                  openAttributeAuditLog(toast.attributeId!);
                  hideToast();
                }}
                sx={{ fontSize: "inherit", verticalAlign: "baseline", cursor: "pointer" }}
              >
                {STR.auditLog.viewHistory}
              </Link>
            </>
          )}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
