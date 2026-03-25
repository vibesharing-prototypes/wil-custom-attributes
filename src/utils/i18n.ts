import type { AttributeType } from "../types/attribute.js";

/**
 * Minimal i18n stub for prototyping.
 * In production, replace with the platform's localization mechanism.
 * All strings use en-US. Keys are provided for future localization without
 * requiring code changes — swap the `t` implementation only.
 */
export const t = (_key: string, fallback: string): string => fallback;

export const STR = {
  required: t("attr.required", "Required"),
  deprecated: t("attr.deprecated", "Deprecated"),
  noValue: t("attr.noValue", "—"),
  yes: t("attr.yes", "Yes"),
  no: t("attr.no", "No"),
  more: t("attr.more", "More"),
  inactive: t("attr.inactive", "Inactive"),
  builtIn: t("attr.builtIn", "Built-in"),
  active: t("attr.active", "Active"),

  schemaViewer: {
    title: t("schemaViewer.title", "Object schema"),
    subtitle: t(
      "schemaViewer.subtitle",
      "Browse the base schema for this object type, including attribute types and descriptions.",
    ),
    customAttributesHeading: t("schemaViewer.customAttributes", "Custom attributes"),
  },

  schemaManagement: {
    title: t("schemaManagement.title", "Schema management"),
    subtitle: t(
      "schemaManagement.subtitle",
      "Add and manage custom attributes to extend the base schema for this object type.",
    ),
    ootbSectionTitle: t("schemaManagement.ootbSection", "Base schema"),
    ootbSectionSubtitle: t(
      "schemaManagement.ootbSectionSubtitle",
      "Built-in attributes provided by the platform. These cannot be edited or removed.",
    ),
    customSectionTitle: t("schemaManagement.customSection", "Custom attributes"),
    customSectionSubtitle: t(
      "schemaManagement.customSectionSubtitle",
      "Attributes added by your organization to extend the base schema.",
    ),
    addAttribute: t("schemaManagement.addAttribute", "Add attribute"),
    emptyState: t(
      "schemaManagement.emptyState",
      "No custom attributes yet. Add your first attribute to extend the schema.",
    ),
    editAttribute: t("schemaManagement.editAttribute", "Edit"),
    deprecateAttribute: t("schemaManagement.deprecate", "Deprecate"),
    reactivateAttribute: t("schemaManagement.reactivate", "Reactivate"),
  },

  form: {
    addTitle: t("form.addTitle", "Add attribute"),
    editTitle: t("form.editTitle", "Edit attribute"),
    chooseType: t("form.chooseType", "Choose a type"),
    chooseTypeHint: t("form.chooseTypeHint", "The type determines what kind of value users can enter. It cannot be changed after saving."),
    changeType: t("form.changeType", "Change type"),
    nameLabel: t("form.nameLabel", "Name"),
    nameHint: t("form.nameHint", "Visible to all users on object records."),
    descriptionLabel: t("form.descriptionLabel", "Description"),
    descriptionHint: t(
      "form.descriptionHint",
      "Explain what this attribute captures, when to use it, and example values. This description is shown to users and consumed by AI assistants.",
    ),
    requiredLabel: t("form.requiredLabel", "Required field"),
    requiredHint: t("form.requiredHint", "Users must fill in this attribute before saving a record."),
    optionsLabel: t("form.optionsLabel", "Options"),
    addOptionLabel: t("form.addOptionLabel", "Add option"),
    addOptionPlaceholder: t("form.addOptionPlaceholder", "Option label"),
    noOptionsYet: t("form.noOptionsYet", "No options added yet."),
    currencyCodeLabel: t("form.currencyCodeLabel", "Currency code"),
    currencyCodeHint: t("form.currencyCodeHint", "ISO 4217 code applied to all values, e.g. USD, EUR, GBP."),
    currencyModeLabel: t("form.currencyModeLabel", "Currency mode"),
    currencyModePerAttribute: t("form.currencyModePerAttribute", "Fixed — same currency for all values"),
    currencyModePerValue: t("form.currencyModePerValue", "Per record — each value can have a different currency"),
    attachmentModeLabel: t("form.attachmentModeLabel", "Upload mode"),
    attachmentModeSingle: t("form.attachmentModeSingle", "Single file"),
    attachmentModeMultiple: t("form.attachmentModeMultiple", "Multiple files"),
    allowGroupsLabel: t("form.allowGroupsLabel", "Allow group selection"),
    allowGroupsHint: t("form.allowGroupsHint", "Lets users select a group in addition to individual users."),
    save: t("form.save", "Save attribute"),
    cancel: t("form.cancel", "Cancel"),
    saving: t("form.saving", "Saving…"),
  },

  schemaManagementKitchenSink: {
    title: t("schemaManagementKitchenSink.title", "Schema management (kitchen sink)"),
    subtitle: t(
      "schemaManagementKitchenSink.subtitle",
      "Design-system exploration view covering all 15 attribute types. Not based on a real product schema.",
    ),
    bannerTitle: t("schemaManagementKitchenSink.bannerTitle", "Design exploration only"),
    bannerBody: t(
      "schemaManagementKitchenSink.bannerBody",
      "This view exists for design-system exploration and type coverage verification. It exercises all 15 attribute types in a single schema and is not representative of any production configuration.",
    ),
  },

  schemaManagementBos: {
    title: t("schemaManagementBos.title", "Schema management (BOS-constrained)"),
    subtitle: t(
      "schemaManagementBos.subtitle",
      "Add and manage custom attributes using the field types available in the current BOS configuration. Additional types will be enabled in Q2.",
    ),
    bannerTitle: t("schemaManagementBos.bannerTitle", "BOS v1 field types"),
    bannerBody: t(
      "schemaManagementBos.bannerBody",
      "This view reflects the limited set of attribute types available in the initial BOS integration. Types like currency, attachment, users, and contact fields will be unlocked starting in Q2.",
    ),
  },

  aiDescription: {
    generateButton: t("ai.descriptionGenerate", "Suggest with AI"),
    generatingLabel: t("ai.descriptionGenerating", "Generating suggestion…"),
    generatedDisclaimer: t("ai.descriptionDisclaimer", "AI-suggested content — review before saving"),
    errorMessage: t("ai.descriptionError", "Couldn't generate a suggestion. Try again."),
    refineButton: t("ai.descriptionRefine", "Refine with AI"),
  },

  descriptionQuality: {
    label: t("quality.label", "Description quality"),
    poor: t("quality.poor", "Needs improvement"),
    fair: t("quality.fair", "Fair"),
    good: t("quality.good", "Good"),
    tooltipTitle: t("quality.tooltipTitle", "Quality criteria"),
  },

  overlap: {
    warningTitle: t("overlap.warningTitle", "Similar attribute exists"),
    warningBody: t(
      "overlap.warningBody",
      "An attribute with a similar name already exists: \"{name}\". Check whether a new attribute is needed or if the existing one can be reused.",
    ),
  },

  deprecationDialog: {
    title: t("deprecation.title", "Deprecate attribute?"),
    subtitle: t("deprecation.subtitle", "Deprecated attributes remain on existing records but are hidden from new entries."),
    reasonLabel: t("deprecation.reasonLabel", "Reason (optional)"),
    reasonHint: t("deprecation.reasonHint", "Shown to users who hover over the deprecated indicator. Example: 'Replaced by Regulatory classification'."),
    confirm: t("deprecation.confirm", "Deprecate"),
    cancel: t("deprecation.cancel", "Cancel"),
  },

  toasts: {
    attributeAdded: t("toast.added", "Attribute added successfully."),
    attributeUpdated: t("toast.updated", "Attribute updated successfully."),
    attributeDeprecated: t("toast.deprecated", "Attribute deprecated."),
    attributeReactivated: t("toast.reactivated", "Attribute reactivated."),
    validationError: t("toast.validationError", "Please fill in all required fields."),
  },

  auditLog: {
    globalTitle: t("auditLog.globalTitle", "Change history"),
    perAttributeTitle: t("auditLog.perAttributeTitle", "Change history"),
    auditLogButton: t("auditLog.auditLogButton", "Change history"),
    changesButton: t("auditLog.changesButton", "Change history"),
    viewHistory: t("auditLog.viewHistory", "View change history"),
    viewFullLog: t("auditLog.viewFullLog", "View full change history"),
    emptyState: t("auditLog.emptyState", "No changes recorded yet."),
    /**
     * "Last modified by Schema Administrator · 2h ago"
     * Used as a link in the edit side sheet header.
     */
    lastModifiedBy: (actor: string, when: string) =>
      `Last modified by ${actor} · ${when}`,
  },
};

/**
 * Human-readable labels for each attribute type.
 * Used in the schema viewer and schema management UI.
 */
export const TYPE_LABELS: Record<AttributeType, string> = {
  text: t("type.text", "Short text"),
  longText: t("type.longText", "Long text"),
  number: t("type.number", "Number"),
  date: t("type.date", "Date"),
  dateTime: t("type.dateTime", "Date & time"),
  singleSelect: t("type.singleSelect", "Single select"),
  multiSelect: t("type.multiSelect", "Multi-select"),
  user: t("type.user", "User"),
  users: t("type.users", "Users"),
  boolean: t("type.boolean", "Boolean"),
  currency: t("type.currency", "Currency"),
  attachment: t("type.attachment", "Attachment"),
  url: t("type.url", "URL"),
  email: t("type.email", "Email"),
  phone: t("type.phone", "Phone"),
};
