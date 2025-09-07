import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./requireLogin.module.scss";

const cx = classNames.bind(styles);

const RequireLogin = ({ open, onClose, onLogin }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cx("overlay")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cx("popup")}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Close button */}
            <button onClick={onClose} className={cx("closeBtn")}>
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>

            {/* Content */}
            <h2 className={cx("title")}>Tính năng cần đăng nhập</h2>
            <p className={cx("message")}>
              Bạn cần đăng nhập để sử dụng tính năng này.
            </p>

            {/* Actions */}
            <div className={cx("actions")}>
              <button onClick={onClose} className={cx("btn", "btnCancel")}>
                Để sau
              </button>
              <button onClick={onLogin} className={cx("btn", "btnLogin")}>
                Đăng nhập
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequireLogin;
