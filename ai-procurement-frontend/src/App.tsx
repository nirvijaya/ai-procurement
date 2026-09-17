import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RfpBuilder from "./pages/RfpBuilder";
import SupplierPortal from "./pages/SupplierPortal";
import Layout from "./components/Layout";
import Compliance from "./pages/compliance-check";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/rfp-builder"
          element={
            <Layout>
              <RfpBuilder />
            </Layout>
          }
        />

        <Route
          path="/supplier-portal"
          element={
            <Layout>
              <SupplierPortal />
            </Layout>
          }
        />
        <Route
          path="/compliance-check"
          element={
            <Layout>
              <Compliance />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;