import { useState } from "react";
import { NavLink, NavSection, RoutedNavLink } from "@diligentcorp/atlas-react-bundle/global-nav";
import ArchiveIcon from "@diligentcorp/atlas-react-bundle/icons/Archive";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import EditFileIcon from "@diligentcorp/atlas-react-bundle/icons/EditFile";
import LogoLabIcon from "@diligentcorp/atlas-react-bundle/icons/LogoLab";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";

import { useThemePreference, type TokenMode } from "./contexts/ThemePreferenceContext.js";

/**
 * App navigation reflecting the four surfaces:
 * 1. Schema management (M1) — Risk object schema aligned with the ERM Baseline Configuration
 *    (default view)
 * 2. Explorations — read-only and experimental views grouped under a collapsible section:
 *    a. Schema viewer (M0) — read-only OOTB schema browser
 *    b. Schema management — BOS-constrained (M1 v1) — limited to field types available in
 *       the current BOS configuration. Exists alongside the full view for stakeholder comparison.
 *    c. Schema management — kitchen sink — all 15 attribute types on a single schema for
 *       design-system exploration and type coverage verification.
 *
 * In production, "Schema management" entries would only appear for users with
 * manage_schema:{object_type} permission (M1 FR-1, FR-12).
 */
export default function Navigation() {
  const { tokenMode, setTokenMode } = useThemePreference();
  const [configOpen, setConfigOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(true);
  const [explorationsOpen, setExplorationsOpen] = useState(false);

  const themeLabels: Record<TokenMode, string> = {
    lens: "Lens (legacy)",
    "atlas-light": "Light",
    "atlas-dark": "Dark",
  };

  return (
    <>
      <RoutedNavLink to="/" end label="Schema management">
        <EditFileIcon slot="icon" />
      </RoutedNavLink>

      <NavSection
        label="Explorations"
        isOpen={explorationsOpen}
        onOpen={() => setExplorationsOpen(true)}
        onClose={() => setExplorationsOpen(false)}
      >
        <LogoLabIcon slot="icon" />

        <RoutedNavLink to="/schema-viewer" label="Schema viewer">
          <DocumentIcon slot="icon" />
        </RoutedNavLink>
        <RoutedNavLink to="/schema-management-bos" label="Schema management (BOS v1)">
          <ArchiveIcon slot="icon" />
        </RoutedNavLink>
        <RoutedNavLink to="/schema-management-kitchen-sink" label="Schema management (kitchen sink)">
          <ArchiveIcon slot="icon" />
        </RoutedNavLink>
      </NavSection>

      <hr />

      <NavSection
        label="App settings"
        isOpen={configOpen}
        onOpen={() => setConfigOpen(true)}
        onClose={() => setConfigOpen(false)}
      >
        <SettingsIcon slot="icon" />

        <NavSection
          label="Theme"
          isOpen={themeOpen}
          onOpen={() => setThemeOpen(true)}
          onClose={() => setThemeOpen(false)}
        >
          {(["lens", "atlas-light", "atlas-dark"] as TokenMode[]).map((mode) => (
            <NavLink
              key={mode}
              as="button"
              label={themeLabels[mode]}
              isCurrent={tokenMode === mode}
              onClick={() => setTokenMode(mode)}
            />
          ))}
        </NavSection>
      </NavSection>
    </>
  );
}
