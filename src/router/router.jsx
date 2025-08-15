import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, Unauthorized, LoginPage, TestUseEffect, PostDetail, NotFound, NewPost, } from "@pages/page";
import ProtectRoute from "../middlewares/ProtectRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestUseEffect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route
          path="/new-post"
          element={
            <ProtectRoute roleRoute="user">
              <NewPost />
            </ProtectRoute>
          }
        />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
