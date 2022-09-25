import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlankLayout } from "../components/layouts/BlankLayout";
import PageNotFound from "../pages/404/PageNotFound";
import Playground from "../pages/playground";
import Rooms from "../pages/rooms";
import { PLAYGROUND } from "./routes";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <BlankLayout>
              <Rooms />
            </BlankLayout>
          }
        />
        <Route
          path={PLAYGROUND(":roomId")}
          element={
            <BlankLayout>
              <Playground />
            </BlankLayout>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
