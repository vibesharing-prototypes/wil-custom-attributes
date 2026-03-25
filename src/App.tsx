import { AppLayout } from "@diligentcorp/atlas-react-bundle";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import Navigation from "./Navigation.js";
import SchemaViewerPage from "./pages/SchemaViewerPage.js";
import SchemaManagementPage from "./pages/SchemaManagementPage.js";
import SchemaManagementBosPage from "./pages/SchemaManagementBosPage.js";
import SchemaManagementKitchenSinkPage from "./pages/SchemaManagementKitchenSinkPage.js";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout orgName="Acme Corp" navigation={<Navigation />}>
            <Outlet />
          </AppLayout>
        }
      >
        <Route index element={<SchemaManagementPage />} />
        <Route path="schema-viewer" element={<SchemaViewerPage />} />
        <Route path="schema-management-bos" element={<SchemaManagementBosPage />} />
        <Route path="schema-management-kitchen-sink" element={<SchemaManagementKitchenSinkPage />} />
      </Route>
    </Routes>
  );
}
