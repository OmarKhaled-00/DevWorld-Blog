import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage/WelcomePage";
import Register from "../components/Register/Register";
import Home from "../pages/Home/Home";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";
import NotificatiosPage from "../pages/Notifications/NotificationsPage";
import CreatePage from "../pages/Create/CreatePage";
import SearchPage from "../pages/Search/SearchPage";
import MyNetworkPage from "../pages/MyNetwork/MyNetworkPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Post from "../pages/Post/Post";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificatiosPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/network" element={<MyNetworkPage />} />
        <Route path="/posts" element={<Post />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
