import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  HomePage,
  Unauthorized,
  LoginPage,
  TestUseEffect,
  PostDetail,
  NotFound,
  NewPost,
  ListPostFilter,
  UserAccount,
  UserCustomer,
  UserPost,
  UserWallet,
  MapPage,
  Register
} from "@pages/page";
import ProtectRoute from "../middlewares/ProtectRoute";

function ScrollHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollHandler /> {/* auto scroll khi reload & khi đổi route */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestUseEffect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/list-post" element={<ListPostFilter />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/new-post" element={
            <ProtectRoute roleRoute="user">
              <NewPost />
            </ProtectRoute>
          }
        />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/* Dashboard */}
        <Route path="/dashboard/account" element={
            <ProtectRoute roleRoute="user">
              <UserAccount />
            </ProtectRoute>
          }
        />
        <Route path="/dashboard/wallet" element={
            <ProtectRoute roleRoute="user">
              <UserWallet />
            </ProtectRoute>
          }
        />
        <Route path="/dashboard/post" element={
            <ProtectRoute roleRoute="user">
              <UserPost />
            </ProtectRoute>
          }
        />
        <Route path="/dashboard/customer" element={
            <ProtectRoute roleRoute="user">
              <UserCustomer/>
            </ProtectRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
