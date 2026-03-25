import { Component, type FC, type ReactNode } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import PageLayout from "../components/PageLayout.js";
import { STR } from "../utils/i18n.js";
import { SchemaManagementView } from "../features/schemaManagement/SchemaManagementView.js";
import { kitchenSinkSchema, kitchenSinkCustomAttributes } from "../features/schemaViewer/sampleData.js";

class SchemaErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <strong>Render error:</strong> {(this.state.error as Error).message}
            <pre style={{ fontSize: 11, marginTop: 8, whiteSpace: "pre-wrap" }}>
              {(this.state.error as Error).stack}
            </pre>
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

/**
 * Kitchen-sink schema management page.
 *
 * Exercises all 15 attribute types in a single schema for design-system
 * exploration and type coverage verification. Not based on a real product
 * schema — exists alongside the Risk schema management page so stakeholders
 * can verify full type coverage independently of production data.
 *
 * Permission gate: in production, only users with manage_schema:{object_type} reach
 * this page. In the prototype, access is simulated via navigation — no real auth enforced.
 */
const SchemaManagementKitchenSinkPage: FC = () => {
  return (
    <PageLayout>
      <PageHeader
        pageTitle={STR.schemaManagementKitchenSink.title}
        pageSubtitle={STR.schemaManagementKitchenSink.subtitle}
      />
      <Box sx={{ mb: 3 }}>
        <Alert severity="info">
          <Box sx={visuallyHidden}>Info</Box>
          <Typography variant="body2" component="span" fontWeight={600}>
            {STR.schemaManagementKitchenSink.bannerTitle}:{" "}
          </Typography>
          <Typography variant="body2" component="span">
            {STR.schemaManagementKitchenSink.bannerBody}
          </Typography>
        </Alert>
      </Box>
      <SchemaErrorBoundary>
        <SchemaManagementView
          schema={kitchenSinkSchema}
          initialCustomAttributes={kitchenSinkCustomAttributes}
        />
      </SchemaErrorBoundary>
    </PageLayout>
  );
};

export default SchemaManagementKitchenSinkPage;
