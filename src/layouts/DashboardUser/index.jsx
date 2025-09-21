import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./dashboardUser.module.scss";
import logo_name from "@images/logo_name.png";
import avatar from "@assets/avatar_defaults/male.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { Grid2x2 } from "lucide-react";
import {
  faUser,
  faCreditCard,
  faCircleQuestion,
  faEye,
  faFileLines,
} from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(styles);

function DashBoardUser({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateDashBoardPage = (url) => {
    const urlObj = {
      account: "/dashboard/account",
      customer: "/dashboard/customer",
      post: "/dashboard/post",
      wallet: "/dashboard/wallet",
    };

    navigate(urlObj[url]);
  };
  

  return (
    <div className={cx("dashboard_container")}>
      <div className={cx("dashboard_left")}>
        <img style={{cursor: "pointer"}} onClick={() => navigate("/")} className={cx("logo_name")} src={logo_name} alt="" />
        <div className={cx("wrapper_link")}>
          <div
            className={cx("nav_item", {
              active: location.pathname === "/dashboard/account",
            })}
            onClick={() => navigateDashBoardPage("account")}
          >
            <FontAwesomeIcon className={cx("icon_user_menu")} icon={faUser} />
            Thông tin cá nhân
          </div>

          <div className={cx("break_line_vertical")}></div>

          <div
            className={cx("nav_item", {
              active: location.pathname === "/dashboard/wallet",
            })}
            onClick={() => navigateDashBoardPage("wallet")}
          >
            <FontAwesomeIcon
              className={cx("icon_user_menu")}
              icon={faCreditCard}
            />
            Quản lý tài chính
          </div>

          <div className={cx("break_line_vertical")}></div>

          <div
            className={cx("nav_item", {
              active: location.pathname === "/dashboard/post",
            })}
            onClick={() => navigateDashBoardPage("post")}
          >
            <FontAwesomeIcon
              className={cx("icon_user_menu")}
              icon={faFileLines}
            />
            Quản lý tin đăng
          </div>

          <div className={cx("break_line_vertical")}></div>

          <div
            className={cx("nav_item", {
              active: location.pathname === "/dashboard/customer",
            })}
            onClick={() => navigateDashBoardPage("customer")}
          >
            <FontAwesomeIcon className={cx("icon_user_menu")} icon={faEye} />
            Thông tin người xem
          </div>
        </div>

        <div className={cx("dashboard_left_bottom")}>
          <div className={cx("user_info")}>
            <div className={cx("wrap_avatar")}>
              <img className={cx("img_avatar")} src={avatar} alt="" />
              <div className={cx("dot_status")}></div>
            </div>
            <div className={cx("user_name")}>
              Tạ Nguyễn Tiến Dũng{" "}
              <span className={cx("status_active")}>Đang hoạt động</span>
            </div>
          </div>
          <button className={cx("btn_logout")}>Đăng xuất</button>
        </div>
      </div>
      <div className={cx("dashboard_right")}>
        <div className={cx("dashboard_content")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DashBoardUser;
