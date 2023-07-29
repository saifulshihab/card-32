import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlankLayout } from "../components/layouts/BlankLayout";
import { useSocketContext } from "../contexts/SocketProvider";
import PageNotFound from "../pages/404/PageNotFound";
import LandingPage from "../pages/landing";
import Playground from "../pages/playground";
import Rooms from "../pages/rooms";
import { LANDING, PLAYGROUND, ROOMS } from "./routes";
import { LoaderIcon } from "react-hot-toast";

const Router: React.FC = () => {
  const { isSocketConnected } = useSocketContext();
  return (
    <BrowserRouter>
      <div className="relative">
        <Routes>
          <Route
            path={LANDING}
            element={
              <BlankLayout>
                <LandingPage />
              </BlankLayout>
            }
          />
          <Route
            path={ROOMS}
            element={
              <BlankLayout>
                <Rooms />
              </BlankLayout>
            }
          />
          <Route
            path={PLAYGROUND}
            element={
              <BlankLayout>
                <Playground />
              </BlankLayout>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        {!isSocketConnected ? (
          <div className="absolute inset-0 flex items-center gap-2 justify-center bg-zinc-700 bg-opacity-70 ">
            <LoaderIcon />
            <p className="text-primary text-lg">Connecting to server...</p>
          </div>
        ) : null}
      </div>
    </BrowserRouter>
  );
};

export default Router;
