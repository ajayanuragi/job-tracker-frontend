import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "@/pages/LoginPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
    </Routes>
  );
}

export default App;
