import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "@images/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@components/component";
import { getCurrentUser } from "@utils/utils";
import maleDefault from "@assets/avatar_defaults/male.png";
import femaleDefault from "@assets/avatar_defaults/female.png";
import { fetchApi } from "@utils/utils";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCreditCard, faCircleQuestion, faEye, faFileLines, faBell} from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Header() {
  const [isLogin, setLogin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [isScroll, setIsScroll] = useState(false);

  const [type, setType] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("needs");
    if (!type) return;
    setType(type.toString());
    return;
  }, [searchParams])

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

  const handleMoveByURLQuery = (params) => {
    const queryParam = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") queryParam.append(key, value);
    });

    navigate(`/list-post?${queryParam.toString()}`);
  };

  const [collapseAvatar, setCollapseAvatar] = useState(false);
  const handleOnclickAvatar = () => {
    setCollapseAvatar(!collapseAvatar);
  };

  const navigateDashBoardUser = (url) => {
    const urlObj = {
      account: "/dashboard/account",
      customer: "/dashboard/customer",
      post: "/dashboard/post",
      wallet: "/dashboard/wallet",
    };

    navigate(urlObj[url]);
  };

  return (
    <div
      key={location.key}
      className={cx("wrapper_header", { scroll: isScroll })}
    >
      <Link to="/">
        <div className={cx("logo")}>
          <img className={cx("logo_img")} src={logo} alt="Logo Homepro" />
        </div>
      </Link>
      <div className={cx("menu")}>
        <div className={cx("menu_item", { active: type == "sell"})}>
          <button
            className={cx("menu_item_btn")}
            onClick={() => handleMoveByURLQuery({ needs: "sell" })}
          >
            Nhà đất bán
          </button>
          <ul className={cx("dropdown_menu")}>
            {categories
              .filter((cate) => cate.type === "sell")
              .map((cate, i) => (
                <li
                  key={i}
                  className={cx("dropdown_menu_item")}
                  onClick={() =>
                    handleMoveByURLQuery({
                      needs: "sell",
                      category: cate.category_slug,
                    })
                  }
                >
                  {cate.category}
                </li>
              ))}
          </ul>
        </div>
        <div className={cx("menu_item", { active: type == "rent"})}>
          <button
            className={cx("menu_item_btn")}
            onClick={() => handleMoveByURLQuery({ needs: "rent" })}
          >
            {" "}
            Nhà đất cho thuê{" "}
          </button>
          <ul className={cx("dropdown_menu")}>
            {categories
              .filter((cate) => cate.type === "rent")
              .map((cate, i) => (
                <li
                  key={i}
                  className={cx("dropdown_menu_item")}
                  onClick={() =>
                    handleMoveByURLQuery({
                      needs: "rent",
                      category: cate.category_slug,
                    })
                  }
                >
                  {" "}
                  {cate.category}
                </li>
              ))}
          </ul>
        </div>
        <div className={cx("menu_item", { active: type == "short_utility"})}>
          <button
            className={cx("menu_item_btn")}
            onClick={() => handleMoveByURLQuery({ needs: "short_utility" })}
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

      {/* ---------------------------- Đã login ---------------------------- */}
      <div className={cx("wrapper_user")}>
        {isLogin ? (
          <>
            <div className={cx("notification")}>
              <FontAwesomeIcon className={cx("icon_notification")} icon={faBell} />
            </div>
            <div className={cx("wrapper_avatar")}>
              <img
                onClick={handleOnclickAvatar}
                className={cx("avatar")}
                src={avatar}
                alt=""
              />
              <div className={cx("dropdown_avatar", { show: collapseAvatar })}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={cx("icon_close_menu")}
                  onClick={() => setCollapseAvatar(false)}
                />
                <div className={cx("user_info_dropdown")}>
                  <div className={cx("dropdown_avatar_item")} onClick={() => navigateDashBoardUser("account")}>
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faUser}
                    />{" "}
                    Thông tin cá nhân{" "}
                  </div>
                  <div className={cx("dropdown_avatar_item")} onClick={() => navigateDashBoardUser("wallet")}>
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faCreditCard}
                    />
                    Quản lý tài chính
                  </div>
                  <div className={cx("dropdown_avatar_item")} onClick={() => navigateDashBoardUser("post")}>
                    {" "}
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faFileLines}
                    />
                    Quản lý tin đăng{" "}
                  </div>
                  <div className={cx("dropdown_avatar_item")} onClick={() => navigateDashBoardUser("customer")}>
                    {" "}
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faEye}
                    />
                    Thông tin người xem{" "}
                  </div>
                </div>
                <div className={cx("break_line")}></div>
                <div className={cx("user_info_dropdown")}>
                  <div className={cx("dropdown_avatar_item")}>
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faCircleQuestion}
                    />
                    Hỗ trợ
                  </div>
                  <div className={cx("dropdown_avatar_item")}>
                    <FontAwesomeIcon
                      className={cx("icon_user_menu")}
                      icon={faRightFromBracket}
                    />
                    Đăng xuất
                  </div>
                </div>
              </div>
            </div>
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
          // {/* ---------------------------- Chưa login ---------------------------- */}
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
