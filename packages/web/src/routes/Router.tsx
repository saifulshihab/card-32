import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlankLayout } from "../components/layouts/BlankLayout";
import PageNotFound from "../pages/404/PageNotFound";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import Playground from "../pages/playground";
import { PrivateRoute } from "./PrivateRoute";
import { HOME, LOGIN, PLAYGROUND } from "./routes";

const Router: React.FC = () => {
  return (
    <div className="w-full h-screen bg-zinc-900 text-zinc-100">
      <BrowserRouter>
        <Routes>
          <Route path={LOGIN} element={<LoginPage />} />

          <Route
            path={HOME}
            element={
              <PrivateRoute layout={BlankLayout}>
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route
            path={PLAYGROUND}
            element={
              <PrivateRoute layout={BlankLayout}>
                <Playground />
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
