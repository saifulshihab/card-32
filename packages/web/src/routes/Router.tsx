import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import PageNotFound from "../pages/404/PageNotFound";
import LandingPage from "../pages/landing";
import Playground from "../pages/playground";
import Rooms from "../pages/rooms";
import { LANDING, PLAYGROUND, ROOMS } from "./routes";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LANDING} element={<LandingPage />} />
        <Route
          path={ROOMS}
          element={
            <MainLayout>
              <Rooms />
            </MainLayout>
          }
        />
        <Route
          path={PLAYGROUND}
          element={
            <MainLayout>
              <Playground />
            </MainLayout>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
