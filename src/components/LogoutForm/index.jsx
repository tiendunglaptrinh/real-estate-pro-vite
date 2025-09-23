import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./logout.module.scss";
import { useNavigate } from "react-router-dom";
import { Spinner, Success } from "@components/component";

const cx = classNames.bind(styles);

const LogoutForm = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogout = () => {
    // Xoá dữ liệu login
    localStorage.removeItem(import.meta.env.VITE_TOKEN_LOGIN);
    localStorage.removeItem("LOGIN_LOCK_EXPIRE");

    setLoading(true);
    setSuccess(false);

    // giả lập request logout
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // sau 2s chuyển hướng login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1000);
  };

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
            {/* Nội dung khi loading / success / bình thường */}
            {loading && <Spinner />} {success && <Success />}
            <h2 className={cx("title")}>Đăng xuất</h2>
            <p className={cx("message")}>
              Bạn có chắc chắn muốn đăng xuất không?
            </p>
            <div className={cx("actions")}>
              <button onClick={onClose} className={cx("btn", "btnCancel")}>
                Hủy
              </button>
              <button onClick={handleLogout} className={cx("btn", "btnLogin")}>
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutForm;
