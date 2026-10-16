import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import App, { Protected, PublicNavbar } from "./App.jsx";
import { AuthProvider } from "./utils/authContext.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PrivateGroups from "./components/PrivateGroup/PrivateGroupDashboard.jsx";

/* Layout wrapper for public pages (Home, Contact) — adds the floating navbar */
function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    /* Public pages with the transparent floating navbar */
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    /* Auth page — standalone, no navbar */
    path: "/auth",
    element: <Auth />,
  },
  {
    /* Authenticated app pages with the dashboard header */
    path: "/",
    element: <App />,
    children: [
      { path: "private-group", element: <Protected><PrivateGroups /></Protected> },
      { path: "user/:user_id", element: <Protected><UserProfile /></Protected> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
