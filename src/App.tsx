import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";
import AppLayout from "@/components/AppLayout";
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const JobsPage = lazy(() => import("@/pages/JobsPage"));
const ApplicationsPage = lazy(() => import("@/pages/ApplicationsPage"));
const JobDetailsPage = lazy(() => import("@/pages/JobDetailsPage"));
const ApplicationDetailsPage = lazy(
  () => import("@/pages/ApplicationDetailsPage"),
);

function App() {
  return (
    <Suspense>
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
    </Suspense>
  );
}

export default App;
