import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "@images/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@components/component";
import { getCurrentUser } from "@utils/utils";
import maleDefault from "@assets/avatar_defaults/male.png";
import femaleDefault from "@assets/avatar_defaults/female.png";
// import gg from "@images/google.png";

const cx = classNames.bind(styles);

function Header() {
  const [isLogin, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);

  // check user
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
    fetchUser();
  }, []);
  
  // set user, avatar
  useEffect(() => {
  if (user) {
    setLogin(true);
    if (user.userAvatar === "default" && user.userSex === "male") {
      setAvatar(maleDefault);
      console.log("avatar male: ", maleDefault);
    } else if (user.userAvatar === "default" && user.userSex === "female") {
      setAvatar(femaleDefault);
      console.log("avatar male: ", maleDefault);
    } else {
      setAvatar(user.userAvatar);
    }
  }
}, [user]);

  return (
    <div className={cx("wrapper_header")}>
      <Link to="/">
        <div className={cx("logo")}>
          <img className={cx("logo_img")} src={logo} alt="Logo Homepro" />
        </div>
      </Link>
      <div className={cx("menu")}>
        <div className={cx("dropdown", "menu_item")}>
          <button
            className={cx("dropdown-toggle", "menu_item_btn")}
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Nhà đất bán
          </button>
          <ul
            className={cx("dropdown-menu")}
            aria-labelledby="dropdownMenuButton1"
          >
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán căn hộ chung cư</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán nhà riêng</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán chung cư mini</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán đất nền</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán kho, nhà xưởng</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Bán bất động sản khác</Link>{" "}
            </li>
          </ul>
        </div>

        <div className={cx("dropdown", "menu_item")}>
          <button
            className={cx("dropdown-toggle", "menu_item_btn")}
            type="button"
            id="dropdownMenuButton2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Nhà đất cho thuê
          </button>
          <ul
            className={cx("dropdown-menu")}
            aria-labelledby="dropdownMenuButton2"
          >
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê căn hộ chung cư</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê chung cư mini</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê phòng trọ</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê văn phòng làm việc</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê kho, nhà xưởng</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê bất động sản khác</Link>{" "}
            </li>
          </ul>
        </div>

        <div className={cx("dropdown", "menu_item")}>
          <button
            className={cx("dropdown-toggle", "menu_item_btn")}
            type="button"
            id="dropdownMenuButton3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {" "}
            Dịch vụ ngắn hạn{" "}
          </button>
          <ul
            className={cx("dropdown-menu")}
            aria-labelledby="dropdownMenuButton3"
          >
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê khách sạn, nhà nghỉ</Link>{" "}
            </li>
            <li className={cx("dropdown-item", "dropdown_menu_item")}>
              {" "}
              <Link to="/">Cho thuê khu nghỉ dưỡng</Link>{" "}
            </li>
          </ul>
        </div>
      </div>
      <div className={cx("wrapper_user")}>
        {isLogin ? (
          <>
            <img className={cx("avatar")} src={avatar} alt="" />
            <Link to="/new-post">
              {" "}
              <Button
                size="small"
                borderRadius="10px"
                background="#B2935D"
                padding="8px 16px"
                color="#fff"
              >
                Đăng tin
              </Button>{" "}
            </Link>
          </>
        ) : (
          <div className={cx("auth_buttons")}>
            <Link to="/login">
              {" "}
              <Button
                size="small"
                borderRadius="10px"
                background="transparent"
                padding="5px 10px"
                color="#fff"
              >
                {" "}
                Đăng nhập{" "}
              </Button>{" "}
            </Link>
            <div className={cx("line")}></div>
            <Link to="/register">
              {" "}
              <Button
                size="small"
                borderRadius="10px"
                background="transparent"
                padding="5px 10px"
                color="#fff"
              >
                {" "}
                Đăng ký{" "}
              </Button>{" "}
            </Link>
            <Link to="/new-post">
              {" "}
              <Button
                size="small"
                borderRadius="10px"
                background="#B2935D"
                padding="8px 16px"
                color="#fff"
              >
                {" "}
                Đăng tin{" "}
              </Button>{" "}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
