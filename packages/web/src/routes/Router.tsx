import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlankLayout } from "../components/layouts/BlankLayout";
import ProfileLayout from "../components/layouts/ProfileLayout";
import PageNotFound from "../pages/404/PageNotFound";
import Appearance from "../pages/appearance";
import LandingPage from "../pages/landing";
import LoginPage from "../pages/login";
import Playground from "../pages/playground";
import Profile from "../pages/profile";
import Settings from "../pages/settings";
import { PrivateRoute } from "./PrivateRoute";
import {
  APPEARANCE,
  LANDING,
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

          <Route path={LANDING} element={<LandingPage />} />

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
