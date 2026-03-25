import { useCallback, useState } from "react";
import type { AttributeDefinition } from "../../../types/attribute.js";
import type { AuditLogEntry, AuditAction, ChangeRecord, ToastState } from "../types.js";
import { STR } from "../../../utils/i18n.js";

/** Hardcoded actor for the prototype — in production this is the authenticated user. */
const PROTOTYPE_ACTOR = "Schema Administrator";

const AUDITABLE_FIELDS: Array<keyof AttributeDefinition> = [
  "name",
  "semanticDescription",
  "required",
];

const FIELD_DISPLAY_NAMES: Partial<Record<keyof AttributeDefinition, string>> = {
  name: "Name",
  semanticDescription: "Description",
  required: "Required field",
};

function computeChanges(
  old: AttributeDefinition,
  updates: Partial<AttributeDefinition>,
): ChangeRecord[] {
  return AUDITABLE_FIELDS.reduce<ChangeRecord[]>((acc, field) => {
    const oldVal = old[field];
    const newVal = updates[field];
    if (newVal !== undefined && newVal !== oldVal) {
      acc.push({
        field: FIELD_DISPLAY_NAMES[field] ?? String(field),
        from: oldVal != null ? String(oldVal) : null,
        to: newVal != null ? String(newVal) : null,
      });
    }
    return acc;
  }, []);
}

function createEntry(
  attributeId: string,
  attributeName: string,
  action: AuditAction,
  changes?: ChangeRecord[],
): AuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    attributeId,
    attributeName,
    action,
    actor: PROTOTYPE_ACTOR,
    timestamp: new Date().toISOString(),
    changes: changes && changes.length > 0 ? changes : undefined,
  };
}

/**
 * Local state management for the schema management surface (M1).
 * In production, these operations would be backed by API calls.
 * Maintains both the custom attribute list and a full audit log of all schema changes.
 */
export function useSchemaManagement(
  initialAttributes: AttributeDefinition[] = [],
  initialAuditEntries: AuditLogEntry[] = [],
) {
  const [customAttributes, setCustomAttributes] = useState<AttributeDefinition[]>(initialAttributes);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditEntries);
  const [toast, setToast] = useState<ToastState>({ open: false, message: "", severity: "success" });

  const showToast = useCallback(
    (message: string, severity: ToastState["severity"] = "success", attributeId?: string) => {
      setToast({ open: true, message, severity, attributeId });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Adds a new attribute. The ID is generated here so the audit entry can reference it
   * immediately, without requiring callers to pre-generate IDs.
   */
  const addAttribute = useCallback(
    (def: Omit<AttributeDefinition, "id">) => {
      const id = `custom-${Date.now()}`;
      const fullDef = { ...def, id } as AttributeDefinition;
      setCustomAttributes((prev) => [...prev, fullDef]);
      setAuditLog((prev) => [...prev, createEntry(id, def.name, "created")]);
      showToast(STR.toasts.attributeAdded, "success", id);
    },
    [showToast],
  );

  /**
   * Updates an existing attribute. Pass `oldAttribute` to capture a field-level diff
   * in the audit log — callers have access to the pre-edit state.
   */
  const updateAttribute = useCallback(
    (id: string, updates: Partial<AttributeDefinition>, oldAttribute?: AttributeDefinition) => {
      const changes = oldAttribute ? computeChanges(oldAttribute, updates) : [];
      setCustomAttributes((prev) =>
        prev.map((attr) => (attr.id === id ? { ...attr, ...updates } : attr)),
      );
      const name = (updates.name ?? oldAttribute?.name) || id;
      setAuditLog((prev) => [...prev, createEntry(id, name, "edited", changes)]);
      showToast(STR.toasts.attributeUpdated, "success", id);
    },
    [showToast],
  );

  const deprecateAttribute = useCallback(
    (id: string, reason?: string, attributeName?: string) => {
      setCustomAttributes((prev) =>
        prev.map((attr) =>
          attr.id === id
            ? {
                ...attr,
                lifecycleStatus: "deprecated",
                deprecationReason: reason,
                deprecatedAt: new Date().toISOString(),
              }
            : attr,
        ),
      );
      const changes: ChangeRecord[] = reason
        ? [{ field: "Deprecation reason", from: null, to: reason }]
        : [];
      setAuditLog((prev) => [
        ...prev,
        createEntry(id, attributeName ?? id, "deprecated", changes),
      ]);
      showToast(STR.toasts.attributeDeprecated, "info", id);
    },
    [showToast],
  );

  const reactivateAttribute = useCallback(
    (id: string, attributeName?: string) => {
      setCustomAttributes((prev) =>
        prev.map((attr) =>
          attr.id === id
            ? {
                ...attr,
                lifecycleStatus: "active",
                deprecationReason: undefined,
                deprecatedAt: undefined,
              }
            : attr,
        ),
      );
      setAuditLog((prev) => [...prev, createEntry(id, attributeName ?? id, "reactivated")]);
      showToast(STR.toasts.attributeReactivated, "success", id);
    },
    [showToast],
  );

  return {
    customAttributes,
    auditLog,
    toast,
    hideToast,
    addAttribute,
    updateAttribute,
    deprecateAttribute,
    reactivateAttribute,
  };
}
