import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login/Login"
import HomeLayout from "../layout/HomeLayout"
import ProtectedRoute from "./ProtectedRoute";
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"))
const MyTask = lazy(() => import("../components/myTask/MyTask"))
const Billing = lazy(() => import("../components/billing/Billing"))
const Setting = lazy(() => import("../components/settings/Setting"))
const MyTeams = lazy(() => import("../components/myTeams/MyTeams"))


export const PrivateRouting = createBrowserRouter([
  {
    path:'/login',
    element:<Login/>
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/my-task",
        element: <MyTask />,
      },
      {
        path: "/my-teams",
        element: <MyTeams />,
      },
      {
        path: "/billing",
        element: <Billing />,
      },
      {
        path: "/settings",
        element: <Setting />,
      },
    ],
  },
]);

export default PrivateRouting;
