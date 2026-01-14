import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CreatorDashboard from "./pages/dashboard/CreatorDashboard";
import ViewerDashboard from "./pages/dashboard/ViewerDashboard";
import Users from "./pages/admin/Users";
import Campaigns from "./pages/admin/Campaigns";
import AddStaff from "./pages/admin/AddStaff";
import { AuthProvider } from "./auth/AuthContext";
import UploadUsers from "./pages/creator/UploadUsers";
import CreateCampaign from "./pages/creator/CreateCampaign";
import EditCampaigns from "./pages/creator/EditCampaigns";
import ViewCampaigns from "./pages/viewer/ViewCampaigns";
import Dashboard from "./pages/user/Dashboard";
import ProfilePage from "./pages/user/ProfilePage";
import PreferencesPage from "./pages/user/PreferencesPage";
import NotificationPage from "./pages/user/NotificationPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/creator" element={<CreatorDashboard />} />
          <Route path="/dashboard/viewer" element={<ViewerDashboard />} />

          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/campaigns" element={<Campaigns />} />
          <Route path="/admin/add-staff" element={<AddStaff />} />

          <Route path="/creator/users/upload" element={<UploadUsers />} />
          <Route
            path="/creator/campaigns/create"
            element={<CreateCampaign />}
          />
          <Route path="/creator/campaigns" element={<EditCampaigns />} />

          <Route path="/viewer/campaigns" element={<ViewCampaigns />} />

          <Route path="/userDashboard" element={<Dashboard />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
