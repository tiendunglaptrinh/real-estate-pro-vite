import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function TransitionPage({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 0, opacity: 0.8 }}
          animate={{ x: "100%", opacity: 0.5 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            zIndex: 9999,
          }}
        />
      )}
    </AnimatePresence>
  );
}
