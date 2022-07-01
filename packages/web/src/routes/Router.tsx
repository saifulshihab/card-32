import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login";
import Playground from "../pages/playground";

const Router: React.FC = () => {
  return (
    <div className="w-full h-screen bg-zinc-900 text-zinc-100 select-none">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
