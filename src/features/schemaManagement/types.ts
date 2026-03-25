import type { AttributeType, Option } from "../../types/attribute.js";

/**
 * State of the attribute creation/edit form.
 * Tracks the two-step progressive disclosure flow:
 *   1. Type selection
 *   2. Attribute configuration (name, description, type-specific config)
 */
export interface AttributeFormState {
  /** Step 1 — null until the user picks a type */
  selectedType: AttributeType | null;

  /** Step 2 — common fields */
  name: string;
  description: string;
  required: boolean;

  /** singleSelect and multiSelect */
  options: Option[];

  /** currency */
  currencyCode: string;
  currencyMode: "perAttribute" | "perValue";

  /** attachment */
  attachmentMode: "single" | "multiple";

  /** user and users */
  allowGroups: boolean;
}

export const INITIAL_FORM_STATE: AttributeFormState = {
  selectedType: null,
  name: "",
  description: "",
  required: false,
  options: [],
  currencyCode: "USD",
  currencyMode: "perAttribute",
  attachmentMode: "multiple",
  allowGroups: false,
};

/** Controls the visibility and purpose of the side sheet. */
export type FormSheetMode = "create" | "edit" | null;

/** Toast notification state */
export interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  /** When set, the toast renders a "View history" link for this attribute. */
  attributeId?: string;
}

/** A single field-level change captured during an edit operation. */
export interface ChangeRecord {
  field: string;
  from: string | null;
  to: string | null;
}

export type AuditAction = "created" | "edited" | "deprecated" | "reactivated";

/** A single entry in the schema change audit log. */
export interface AuditLogEntry {
  id: string;
  attributeId: string;
  attributeName: string;
  action: AuditAction;
  /** In production this would be the authenticated user. Prototype uses a fixed label. */
  actor: string;
  timestamp: string;
  /** Field-level changes captured for edit operations. */
  changes?: ChangeRecord[];
}
