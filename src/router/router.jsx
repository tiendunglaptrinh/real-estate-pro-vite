import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, Unauthorized, LoginPage, TestUseEffect} from "@pages/page"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestUseEffect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
