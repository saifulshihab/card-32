import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login";
import Playground from "../pages/playground";

const Router: React.FC = () => {
  return (
    <div className="min-w-full min-h-screen bg-zinc-900 text-gray-100">
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
