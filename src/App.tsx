import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import JobsPage from "@/pages/JobsPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import JobDetailsPage from "@/pages/JobDetailsPage";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route
            path="/applications/:id"
            element={<ApplicationDetailsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
