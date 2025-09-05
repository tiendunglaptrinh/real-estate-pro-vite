import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "@images/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@components/component";
import { getCurrentUser } from "@utils/utils";
import maleDefault from "@assets/avatar_defaults/male.png";
import femaleDefault from "@assets/avatar_defaults/female.png";
import { fetchApi } from "@utils/utils";
// import gg from "@images/google.png";

const cx = classNames.bind(styles);

function Header() {
  const [isLogin, setLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [isScroll, setIsScroll] = useState(false);

  const navigate = useNavigate();

  // check user
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Get category
  useEffect(() => {
    const getRealEstateCategory = async () => {
      const url = "/category/all";
      const response_data = await fetchApi(url, {
        method: "get",
        skipAuth: true,
      });

      if (response_data.success) {
        setCategories(response_data.category);
      } else return;
    };
    getRealEstateCategory();
  }, []);

  const handleMoveSellPost = () => {
    const url = "/login";
    // navigate(url);
  };
  const hanldeMoveRentPost = () => {
    const url = "/login";
    // navigate(url);
  };
  const hanldeMoveShortUtilityPost = () => {
    const url = "/login";
    // navigate(url);
  };

  return (
    <div className={cx("wrapper_header", { scroll: isScroll })}>
      <Link to="/">
        <div className={cx("logo")}>
          <img className={cx("logo_img")} src={logo} alt="Logo Homepro" />
        </div>
      </Link>
      <div className={cx("menu")}>
        <div className={cx("menu_item")}>
          <button className={cx("menu_item_btn")} onClick={handleMoveSellPost}>
            Nhà đất bán
          </button>
          <ul className={cx("dropdown_menu")}>
            {categories
              .filter((cate) => cate.type === "sell")
              .map((cate, i) => (
                <li key={i} className={cx("dropdown_menu_item")}>
                  <Link to="/">{cate.category}</Link>
                </li>
              ))}
          </ul>
        </div>
        <div className={cx("menu_item")}>
          <button className={cx("menu_item_btn")} onClick={hanldeMoveRentPost}>
            {" "}
            Nhà đất cho thuê{" "}
          </button>
          <ul className={cx("dropdown_menu")}>
            {categories
              .filter((cate) => cate.type === "rent")
              .map((cate, i) => (
                <li key={i} className={cx("dropdown_menu_item")}>
                  {" "}
                  <Link to="/">{cate.category}</Link>{" "}
                </li>
              ))}
          </ul>
        </div>
        <div className={cx("menu_item")}>
          <button
            className={cx("menu_item_btn")}
            onClick={hanldeMoveShortUtilityPost}
          >
            {" "}
            Tiện ích ngắn hạn{" "}
          </button>
          <ul className={cx("dropdown_menu")}>
            {categories
              .filter((cate) => cate.type === "short_utility")
              .map((cate, i) => (
                <li key={i} className={cx("dropdown_menu_item")}>
                  {" "}
                  <Link to="/">{cate.category}</Link>{" "}
                </li>
              ))}
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
                className={cx("btn_login")}
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
                className={cx("btn_register")}
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
              className={cx("btn_post")}
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
