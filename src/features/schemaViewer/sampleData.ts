import type { AttributeDefinition, ObjectSchema } from "../../types/attribute.js";
import type { AuditLogEntry } from "../schemaManagement/types.js";

/**
 * Risk Object Schema — aligned with the ERM Baseline Configuration.
 *
 * Sources:
 *   - ERM Baseline Configuration (last updated Jan 28, 2026)
 *   - ERM Baseline Configuration Updates H2/2025 (last updated Feb 13, 2026)
 *
 * Sections represented (flat list, M3 sectioning not yet implemented):
 *   Overview (5 attributes) → Score (4 documented attributes) → Attachments (1 attribute)
 *
 * Attributes marked ⚠️ in the spec (IRS Quantitative, RRS Quantitative, Supported files)
 * are excluded — they are not documented in the baseline config.
 *
 * Display name renames listed in the spec (e.g. "Risk description" → "Description") are
 * noted in semanticDescription but not yet applied — rename is a planned update.
 */
export const riskSchema: ObjectSchema = {
  objectType: "risk",
  objectName: "Risk",
  objectDescription:
    "A potential event or condition that could negatively affect organizational objectives. Risks are assessed, scored, owned, and linked to controls, mitigation plans, and processes across the GRC suite. Managed by the Risk Manager and Risk Essentials toolkits.",
  attributes: [
    // ── Overview ──────────────────────────────────────────────────────────────
    {
      id: "name",
      name: "Name",
      type: "text",
      required: true,
      isOotb: true,
      semanticDescription:
        "The title of this risk record. Should be concise and specific enough to distinguish the risk within a portfolio (e.g. 'Third-party vendor data breach'). Required before the record can be moved out of Draft status.",
    },
    {
      id: "risk_description",
      name: "Risk description",
      type: "longText",
      isOotb: true,
      semanticDescription:
        "Plain-language summary of the risk, its drivers, and potential impact on the organization. Planned display rename: 'Description'. Should be specific enough for a non-specialist to understand the exposure without prior context.",
    },
    {
      id: "risk_category",
      name: "Risk category",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "brand_reputation", label: "Brand & Reputation Relevance & Execution" },
        { id: "operational", label: "Operational" },
        { id: "it_infosec", label: "IT/Infosec" },
        { id: "financial", label: "Financial" },
        { id: "regulatory_compliance", label: "Regulatory/Compliance" },
        { id: "growth", label: "Growth" },
        { id: "human_resource", label: "Human Resource" },
        { id: "legislative_regulatory", label: "Legislative and Regulatory" },
        { id: "market_expansion", label: "Market Expansion" },
        { id: "acquisition", label: "Acquisition" },
        { id: "artificial_intelligence", label: "Artificial Intelligence" },
        { id: "business_continuity", label: "Business Continuity" },
        { id: "business_industry", label: "Business and Industry" },
        { id: "company_culture", label: "Company Culture" },
        { id: "competitor", label: "Competitor" },
        { id: "customer_retention", label: "Customer Retention" },
        { id: "economic", label: "Economic" },
        { id: "fraud", label: "Fraud" },
        { id: "process_efficiency", label: "Process or Operational Efficiency" },
        { id: "third_party", label: "Third Party" },
      ],
      semanticDescription:
        "Primary classification used for portfolio-level reporting and ownership routing. Planned display rename: 'Category'. Choose the category that best represents the nature of the risk.",
    },
    {
      id: "risk_id",
      name: "Risk ID",
      type: "text",
      isOotb: true,
      semanticDescription:
        "Unique identifier for this risk record. Used for cross-referencing in reports, audits, and control mappings (e.g. 'RISK-2024-001'). Typically system-generated or assigned by the risk team.",
    },
    {
      id: "risk_owner",
      name: "Risk owner",
      type: "user",
      required: true,
      isOotb: true,
      semanticDescription:
        "Accountable individual responsible for monitoring and responding to this risk. Planned display rename: 'Owner'. Must have authority to approve mitigation actions. Typically a senior manager or department head.",
    },

    // ── Score ─────────────────────────────────────────────────────────────────
    {
      id: "risk_impact",
      name: "Impact",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "very_low", label: "Very low" },
        { id: "low", label: "Low" },
        { id: "medium", label: "Medium" },
        { id: "high", label: "High" },
        { id: "very_high", label: "Very high" },
      ],
      semanticDescription:
        "Severity of the consequences if this risk materializes, assessed before controls are applied. Planned display rename: 'Impact (inherent)'. Used together with Likelihood to derive the Inherent Risk Score.",
    },
    {
      id: "likelihood",
      name: "Likelihood",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "very_low", label: "Very low" },
        { id: "low", label: "Low" },
        { id: "medium", label: "Medium" },
        { id: "high", label: "High" },
        { id: "very_high", label: "Very high" },
      ],
      semanticDescription:
        "Probability that this risk will occur, assessed before controls are applied. Planned display rename: 'Likelihood (inherent)'. Used together with Impact to derive the Inherent Risk Score.",
    },
    {
      id: "inherent_risk_score",
      name: "Inherent risk score",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "very_low", label: "Very low" },
        { id: "low", label: "Low" },
        { id: "medium", label: "Medium" },
        { id: "high", label: "High" },
        { id: "very_high", label: "Very high" },
      ],
      semanticDescription:
        "Overall risk level before any controls are applied, derived from Likelihood × Impact. Planned display rename: 'Inherent Risk Rating'. Used to prioritize mitigation effort and compare risks across the portfolio.",
    },
    {
      id: "residual_risk_score",
      name: "Residual risk score",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "very_low", label: "Very low" },
        { id: "low", label: "Low" },
        { id: "medium", label: "Medium" },
        { id: "high", label: "High" },
        { id: "very_high", label: "Very high" },
      ],
      semanticDescription:
        "Remaining risk level after controls and mitigations have been applied. Planned display rename: 'Residual Risk Rating'. Compared against the Inherent Risk Score to assess control effectiveness.",
    },

    // ── Attachments ───────────────────────────────────────────────────────────
    {
      id: "risk_attachment",
      name: "Attachment",
      type: "attachment",
      attachmentMode: "multiple",
      isOotb: true,
      semanticDescription:
        "Documents that support or substantiate this risk record, such as audit findings, incident reports, regulatory notices, or risk assessments. Attach PDFs, spreadsheets, or images. Multiple files are supported.",
    },
  ],
};

/**
 * Pre-seeded custom attributes for the Risk schema management prototype.
 *
 * These represent planned Score section additions from the H2/2025 roadmap
 * (target Q4 2025 / Q1 2026) that a Schema Administrator has already configured
 * as custom attributes ahead of their planned promotion to OOTB fields.
 *
 * One attribute is deprecated to demonstrate the attribute lifecycle flow.
 */
export const initialCustomAttributes: AttributeDefinition[] = [
  {
    id: "custom-likelihood-residual",
    name: "Likelihood (residual)",
    type: "singleSelect",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    options: [
      { id: "very_low", label: "Very low" },
      { id: "low", label: "Low" },
      { id: "medium", label: "Medium" },
      { id: "high", label: "High" },
      { id: "very_high", label: "Very high" },
    ],
    semanticDescription:
      "Probability that this risk will occur after existing controls and mitigations are applied. Used alongside Impact (residual) to derive the residual risk rating. Planned for promotion to a built-in Score field.",
  },
  {
    id: "custom-impact-residual",
    name: "Impact (residual)",
    type: "singleSelect",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    options: [
      { id: "very_low", label: "Very low" },
      { id: "low", label: "Low" },
      { id: "medium", label: "Medium" },
      { id: "high", label: "High" },
      { id: "very_high", label: "Very high" },
    ],
    semanticDescription:
      "Severity of consequences after controls and mitigations are applied. Used alongside Likelihood (residual) to derive the residual risk rating. Planned for promotion to a built-in Score field.",
  },
  {
    id: "custom-assessment-due-date",
    name: "Assessment due date",
    type: "dateTime",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    semanticDescription:
      "Date by which the next formal risk assessment must be completed. Used to trigger review reminders and identify overdue assessments in portfolio dashboards.",
  },
  {
    id: "custom-risk-appetite",
    name: "Risk appetite",
    type: "singleSelect",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    options: [
      { id: "averse", label: "Averse" },
      { id: "minimal", label: "Minimal" },
      { id: "cautious", label: "Cautious" },
      { id: "open", label: "Open" },
      { id: "hungry", label: "Hungry" },
    ],
    semanticDescription:
      "The organization's stated level of risk appetite for this risk type, as defined in the risk appetite framework. Compared against the current risk score to flag out-of-appetite exposures.",
  },
  {
    id: "custom-risk-tier-legacy",
    name: "Risk tier (legacy)",
    type: "text",
    required: false,
    isOotb: false,
    lifecycleStatus: "deprecated",
    deprecationReason:
      "Replaced by the structured 'Risk category' built-in attribute as part of the ERM schema standardization. Historical values are preserved on existing records for audit purposes.",
    deprecatedAt: "2025-11-15T09:00:00Z",
    semanticDescription:
      "Free-text tier label inherited from the legacy risk register. No longer used for new records.",
  },
];

/**
 * Pre-seeded audit log entries for the initial custom attributes.
 * Represents the creation events that would have been captured by the backend
 * when these attributes were first defined. All dated March 26, 2025.
 */
export const initialAuditLog: AuditLogEntry[] = initialCustomAttributes.map((attr) => ({
  id: `audit-seed-${attr.id}`,
  attributeId: attr.id,
  attributeName: attr.name,
  action: "created",
  actor: "Schema Administrator",
  timestamp: "2025-03-26T10:00:00.000Z",
}));

/**
 * Kitchen-sink schema: demonstrates all 12 canonical attribute types across
 * a single object schema. Used by the kitchen-sink page for design-system
 * exploration and type coverage verification.
 *
 * Not based on a real product schema — exists solely to exercise every
 * attribute type in a single view.
 */
export const kitchenSinkSchema: ObjectSchema = {
  objectType: "risk",
  objectName: "Risk",
  objectDescription:
    "A potential event or condition that could negatively affect organizational objectives. Risks are assessed, owned, and linked to controls and audit findings across the GRC suite. Managed by the Risk Manager team.",
  attributes: [
    {
      id: "riskId",
      name: "Risk ID",
      type: "text",
      required: true,
      isOotb: true,
      semanticDescription:
        "Unique identifier for this risk record. Used for cross-referencing in reports, audits, and control mappings. Example: 'RISK-2024-001'.",
    },
    {
      id: "riskDesc",
      name: "Risk description",
      type: "longText",
      isOotb: true,
      semanticDescription:
        "Plain-language summary of the risk, its drivers, and potential impact. Should be specific enough for a non-specialist to understand the exposure without prior context.",
    },
    {
      id: "riskCategory",
      name: "Risk category",
      type: "singleSelect",
      isOotb: true,
      options: [
        { id: "strategic", label: "Strategic" },
        { id: "operational", label: "Operational" },
        { id: "financial", label: "Financial" },
        { id: "compliance", label: "Compliance" },
        { id: "reputational", label: "Reputational" },
        { id: "other", label: "Other", deprecated: true },
      ],
      semanticDescription:
        "Primary classification for portfolio-level reporting and ownership routing. Choose the category that best represents the nature of the risk. 'Other' is deprecated — select a specific category.",
    },
    {
      id: "applicableRegulations",
      name: "Applicable regulations",
      type: "multiSelect",
      isOotb: true,
      options: [
        { id: "sox", label: "SOX" },
        { id: "gdpr", label: "GDPR" },
        { id: "iso27001", label: "ISO 27001" },
        { id: "hipaa", label: "HIPAA" },
        { id: "pcidss", label: "PCI DSS" },
        { id: "nist", label: "NIST CSF" },
      ],
      semanticDescription:
        "Regulatory frameworks or standards that apply to this risk. Used to scope compliance audits and produce regulatory reporting. Select all that are relevant.",
    },
    {
      id: "riskOwner",
      name: "Risk owner",
      type: "user",
      required: true,
      isOotb: true,
      semanticDescription:
        "Accountable individual responsible for monitoring and responding to this risk. Must have authority to approve mitigation actions. Typically a senior manager or department head.",
    },
    {
      id: "reviewCommittee",
      name: "Review committee",
      type: "users",
      isOotb: true,
      semanticDescription:
        "Additional individuals involved in periodic risk review. Distinct from the risk owner — these are secondary reviewers or escalation contacts, not the primary accountable party.",
    },
    {
      id: "inherentScore",
      name: "Inherent risk score",
      type: "number",
      isOotb: true,
      semanticDescription:
        "Baseline risk level before controls are applied, calculated from likelihood × impact. Range: 1–25. Used to compare risks across the portfolio and prioritize mitigation effort.",
    },
    {
      id: "targetResolutionDate",
      name: "Target resolution date",
      type: "date",
      isOotb: true,
      semanticDescription:
        "Date by which the risk is expected to be fully mitigated or formally accepted. Used to track progress and trigger escalation notifications when the date passes.",
    },
    {
      id: "lastReviewedAt",
      name: "Last reviewed at",
      type: "dateTime",
      isOotb: true,
      semanticDescription:
        "Timestamp of the most recent formal review of this risk record. Used to identify stale records that haven't been reviewed within the required review cycle (typically quarterly).",
    },
    {
      id: "mitigationPresent",
      name: "Mitigation plan in place?",
      type: "boolean",
      isOotb: true,
      semanticDescription:
        "Indicates whether a documented mitigation plan exists for this risk. A value of 'Yes' does not confirm the plan is effective — use inherent and residual scores to assess actual control effectiveness.",
    },
    {
      id: "estimatedImpact",
      name: "Estimated financial impact",
      type: "currency",
      currencyMode: "perAttribute",
      isOotb: true,
      semanticDescription:
        "Estimated monetary loss if the risk materializes, expressed in the organization's reporting currency. Used for board-level risk reporting and prioritization of mitigation investment.",
    },
    {
      id: "evidence",
      name: "Supporting evidence",
      type: "attachment",
      attachmentMode: "multiple",
      isOotb: true,
      semanticDescription:
        "Documents that substantiate the risk assessment, such as audit findings, incident reports, regulatory notices, or risk assessments. Attach PDFs, spreadsheets, or images.",
    },
  ],
};

/**
 * Pre-seeded custom attributes for the kitchen-sink schema management prototype.
 * These demonstrate the range of custom attribute types and lifecycle states,
 * including one deprecated attribute with a reason (tooltip demo).
 */
export const kitchenSinkCustomAttributes: AttributeDefinition[] = [
  {
    id: "custom-risk-contact",
    name: "Risk contact email",
    type: "email",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    semanticDescription:
      "Direct email address for the internal contact who should be notified of significant changes to this risk. Used for automated escalation emails from the notification pipeline.",
  },
  {
    id: "custom-risk-url",
    name: "External reference URL",
    type: "url",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    semanticDescription:
      "Link to an external resource that provides context for this risk, such as a regulatory notice, industry benchmark, or third-party risk advisory. Prefix with https://.",
  },
  {
    id: "custom-risk-severity-tier",
    name: "Severity tier",
    type: "singleSelect",
    required: false,
    isOotb: false,
    lifecycleStatus: "active",
    options: [
      { id: "critical", label: "Critical" },
      { id: "high", label: "High" },
      { id: "medium", label: "Medium" },
      { id: "low", label: "Low" },
    ],
    semanticDescription:
      "Qualitative severity classification used by the executive dashboard. Distinct from the quantitative inherent score — tier is a human-assigned label for executive-facing reports.",
  },
  {
    id: "custom-risk-legacy-tag",
    name: "Legacy classification",
    type: "text",
    required: false,
    isOotb: false,
    lifecycleStatus: "deprecated",
    deprecationReason:
      "Replaced by 'Severity tier' (singleSelect) as part of the Q1 schema standardization. Existing values are preserved on historical records for audit purposes.",
    deprecatedAt: "2025-03-01T09:00:00Z",
    semanticDescription:
      "Free-text classification label inherited from the legacy risk register. No longer used for new records.",
  },
];
