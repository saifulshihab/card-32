import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlankLayout } from "../components/layouts/BlankLayout";
import MainLayout from "../components/layouts/MainLayout";
import ProfileLayout from "../components/layouts/ProfileLayout";
import PageNotFound from "../pages/404/PageNotFound";
import Appearance from "../pages/appearance";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import Playground from "../pages/playground";
import Profile from "../pages/profile";
import Settings from "../pages/settings";
import { PrivateRoute } from "./PrivateRoute";
import {
  APPEARANCE,
  HOME,
  LOGIN,
  PLAYGROUND,
  PROFILE,
  SETTINGS,
} from "./routes";

const Router: React.FC = () => {
  return (
    <div className="w-full h-screen bg-zinc-900 text-zinc-100">
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN} element={<LoginPage />} />

          <Route
            path={HOME}
            element={
              <PrivateRoute layout={MainLayout}>
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route
            path={PROFILE}
            element={
              <PrivateRoute layout={ProfileLayout}>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path={APPEARANCE}
            element={
              <PrivateRoute layout={ProfileLayout}>
                <Appearance />
              </PrivateRoute>
            }
          />

          <Route
            path={PLAYGROUND(":roomId")}
            element={
              <PrivateRoute layout={BlankLayout}>
                <Playground />
              </PrivateRoute>
            }
          />

          <Route
            path={SETTINGS}
            element={
              <PrivateRoute layout={ProfileLayout}>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
