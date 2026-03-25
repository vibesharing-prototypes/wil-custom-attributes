/**
 * Canonical set of 15 attribute types supported by the Object Library.
 * Source of truth: M0 PRD FR-1, M1 PRD FR-2, M1 Q4 resolution.
 *
 * url, email, phone are separate types to avoid validation/format conflicts
 * and preserve the ability to render them with appropriate affordances (links, mailto, tel).
 */
export type AttributeType =
  | "text"
  | "longText"
  | "number"
  | "date"
  | "dateTime"
  | "singleSelect"
  | "multiSelect"
  | "user"
  | "users"
  | "boolean"
  | "currency"
  | "attachment"
  | "url"
  | "email"
  | "phone";

/**
 * An option in a singleSelect or multiSelect attribute.
 * Deprecated options are preserved on existing records but not offered for new values.
 */
export interface Option {
  id: string;
  label: string;
  deprecated?: boolean;
}

/**
 * Lifecycle state of a custom attribute.
 * OOTB attributes are always "active" — they cannot be deprecated by customers.
 * Custom attributes transition: active → deprecated (reversible via reactivation).
 */
export type AttributeLifecycleStatus = "active" | "deprecated";

/**
 * Definition of a single attribute on an object schema.
 * Applies to both OOTB attributes (immutable) and custom attributes (managed by Schema Administrators).
 */
export interface AttributeDefinition {
  id: string;
  name: string;
  type: AttributeType;
  required?: boolean;

  /**
   * Mandatory for custom attributes (M1 FR-3).
   * Must be high-quality: explains purpose, expected values, and business context.
   * Consumed by end users (tooltip/helper text) and by M2 AI agents — same quality bar for both.
   */
  semanticDescription?: string;

  /** singleSelect and multiSelect only */
  options?: Option[];

  /**
   * Currency display mode.
   * - perAttribute: one currency code applies to all values of this attribute
   * - perValue: each individual value carries its own currency code
   * Open question: M1 Q1 — decision pending.
   * Current default for prototyping: perAttribute.
   */
  currencyMode?: "perAttribute" | "perValue";

  /**
   * Attachment upload mode.
   * Open question: M1 Q2 — decision pending.
   * Current default for prototyping: multiple.
   */
  attachmentMode?: "single" | "multiple";

  /**
   * Whether this user/users attribute accepts group selections in addition to individuals.
   * Open question: M1 Q3 — decision pending.
   * Current default for prototyping: false (individual users only).
   */
  allowGroups?: boolean;

  /** Custom attributes only — not present on OOTB attributes */
  lifecycleStatus?: AttributeLifecycleStatus;

  /**
   * Reason provided when deprecating a custom attribute.
   * Displayed in the deprecated chip tooltip to help users understand why the attribute
   * is no longer active. Example: "Replaced by 'Regulatory classification' (M1 migration)".
   */
  deprecationReason?: string;

  /** ISO timestamp when the attribute was deprecated, for audit/display purposes. */
  deprecatedAt?: string;

  /** true for OOTB attributes; false/absent for custom attributes */
  isOotb?: boolean;
}

/**
 * A named section grouping attributes within a schema.
 * Planned for M3: users will be able to define their own sections to organize
 * attributes into logical groups (e.g., "Identification", "Risk assessment", "Compliance").
 *
 * Structural constraint: the current flat `attributes` list in `ObjectSchema` and
 * the `AttributeManagementList` component must be refactorable to support sections
 * without a full rewrite. The natural extension is to introduce `sections` as an
 * ordered array, with each section holding a subset of attribute IDs or definitions.
 * OOTB sections would be immutable; custom sections would be user-managed.
 *
 * Not yet implemented — tracked here to ensure no current decisions preclude it.
 */
export interface SchemaSection {
  id: string;
  name: string;
  /** Attribute IDs in display order within this section */
  attributeIds: string[];
  /** OOTB sections cannot be renamed or removed by customers */
  isOotb?: boolean;
}

/**
 * The full schema for an Object Library object type.
 * Includes OOTB attributes (immutable) and custom attributes (managed by Schema Administrators).
 *
 * M3 extension point: `sections` will be added here to support grouped attribute sections.
 * The current flat `attributes` array is compatible with this — sections will reference
 * attribute IDs rather than embedding definitions inline.
 */
export interface ObjectSchema {
  /** Machine identifier, e.g. "risk", "control", "asset" */
  objectType: string;
  /** Localized display name, e.g. "Risk" */
  objectName: string;
  /**
   * Semantic description of the object type.
   * Required for OOTB objects (M0 FR-6). Consumed by M2 AI agents.
   */
  objectDescription?: string;
  attributes: AttributeDefinition[];
  /**
   * M3 planned: ordered sections for grouping attributes.
   * Not used in M0/M1 — reserved to avoid a breaking type change when M3 lands.
   */
  sections?: SchemaSection[];
}
