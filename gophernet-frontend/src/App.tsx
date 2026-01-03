import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/signin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import EventManager from "./pages/admin/EventManager";
import UserManager from "./pages/admin/UserManager";
import ScheduledEvents from "./pages/admin/ScheduledEvents";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Admin routes - protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="scheduled" element={<ScheduledEvents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
