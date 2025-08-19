import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Calculator from './pages/Calculator';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calculator" element={<Calculator />} /> 
      {/* Login/Register/OTP page */}
      <Route path="/admin-auth" element={<AdminAuth onAuthSuccess={() => window.location.href = "/admin"} />} />

      {/* Protected Admin Page */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
     
    </Routes>
  );
}
