import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner, Success, ImageSlider } from "@components/component";
import React from "react";
import gg from "@images/google.png";
import apple from "@images/apple.png";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "@utils/utils.jsx";
import bg from "@backgrounds/bg_login.png";
import ReCAPTCHA from "react-google-recaptcha";
// import process from 'process';

const cx = classNames.bind(styles);

const LoginPage = () => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [infoUser, setInfoUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowSuccess, setShowSuccess] = useState(false);

  const [showCaptcha, setShowcaptcha] = useState(false);
  const re_captcha = useRef();
  const [locktime, setLocktime] = useState(0);
  const [locked, setLocked] = useState(false);
  const [flagLogin, setFlagLogin] = useState(true);

  //-------------- BEGIN INPUT INFOR --------------
  const handleInfoUserChange = (e) => {
    setInfoUser(e.target.value);
    setError(null);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const getUser = async () => {
    const url_get_me = "account/me";
    try {
      const response_data = await fetchApi(url_get_me, {
        method: "get",
        body: null,
        skipAuth: false,
      });
      return response_data;
    } catch (err) {
      if (err?.response) {
        console.error("API Error:", err.response);
        return err.response;
      } else {
        console.error("Unexpected Error:", err);
        return { success: false, message: "Network error or unexpected error" };
      }
    }
  };

useEffect(() => {
  let timer;
  setLoading(true);

  const checkLogin = async () => {
    const data = await getUser();
    if (data?.success) {
      console.log(">>>")
      console.log("✅ Haved login before");
      timer = setTimeout(() => navigate("/"), 2000);
    } else {
      console.log("❌ Not logged in");
      setFlagLogin(false);
    }
  };

  checkLogin();

  return () => clearTimeout(timer);
}, [navigate]);

  useEffect(() => {
    if (!flagLogin) { setLoading(false); }
  }, [flagLogin])

  useEffect(() => {
    if (!isShowSuccess) return;
    const timer = setTimeout(() => navigate("/"), 2000);
    return () => clearTimeout(timer);
  }, [isShowSuccess, navigate]);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  //-------------- END INPUT INFOR --------------

  useEffect(() => {
    if (locktime <= 0) {
      setLocked(false);
      setError(null);
      localStorage.removeItem("LOGIN_LOCK_EXPIRE");
      return;
    }

    setLocked(true);
    setError(`Bị khóa đăng nhập trong ${locktime} giây!`);

    const timer = setInterval(() => {
      setLocktime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLocked(false);
          setError(null);
          localStorage.removeItem("LOGIN_LOCK_EXPIRE");
          return 0;
        }
        const next = prev - 1;
        setError(`Bị khóa đăng nhập trong ${next} giây!`);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [locktime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const captchaToken = re_captcha.current?.getValue();
      const body = {
        info_user: infoUser,
        password: password,
        token_captcha: captchaToken,
      };
      const url_login = "/account/login";
      const response_data = await fetchApi(url_login, {
        method: "post",
        body,
        skipAuth: true,
      });

      if (response_data.success) {
        localStorage.setItem(import.meta.env.VITE_TOKEN_LOGIN, response_data.access_token);
      }
      console.log("LOGIN >>> check data fetch: ", response_data);
      setShowSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        console.log(">>> check error response: ", data);
        if (data.captcha_required) {
          const waitSeconds = Number(data.wait_seconds) || 0;
          const expireAt = Date.now() + waitSeconds * 1000;
          console.log(">> lock in: ", expireAt);
          localStorage.setItem("LOGIN_LOCK_EXPIRE", expireAt);
          setShowcaptcha(true);
          console.log(">> update locktime from server: ", waitSeconds);
          setLocktime(waitSeconds);
          setLocked(true);
          setError(`Bị khóa đăng nhập trong ${waitSeconds} giây!`);
        } else {
          setShowcaptcha(false);
          setError(data.message);
        }
      }
    } finally {
      setLoading(false);
      re_captcha.current?.reset();
    }
  };

  return (
    <div className={cx("wrapper_loginform")}>
      {isShowSuccess && <Success />}
      {loading && <Spinner />}
      <div className={cx("wrapper_login")}>
        <form className={cx("login_content")} onSubmit={handleSubmit}>
          <div className={cx("right_content")}>
            <div className={cx("hello")}>Xin chào bạn</div>
            <div className={cx("login_title")}>Đăng nhập để tiếp tục</div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faUser} />
              <input
                value={infoUser}
                onChange={handleInfoUserChange}
                required
                type="text"
                placeholder="Số điện thoại hoặc email"
                autoComplete="current-username"
              />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                required
              />
            </div>
            {showCaptcha && (
              <div className={cx("wrapper_captcha")}>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  ref={re_captcha}
                />
              </div>
            )}
            <Button
              className={cx("btn_login")}
              width="100%"
              height="50px"
              borderRadius="4px"
              background="#b2935d"
              color="#fff"
              type="submit"
              disabled={loading || locked}
            >
              {" "}
              Đăng nhập{" "}
            </Button>
            {error && <div className={cx("error_login")}>{error}</div>}
            <div className={cx("other_option")}>
              <div className={cx("remember_pass")}>
                <label>
                  <input
                    className={cx("check_remember")}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span className={cx("other_option_text")}>Nhớ mật khẩu</span>
                </label>
              </div>
              <div className={cx("forgot_password")}>
                <span className={cx("other_option_text")}>Quên mật khẩu</span>
              </div>
            </div>
            <div className={cx("line_with_text")}>
              <span style={{ fontSize: "18px" }}>Hoặc</span>
            </div>
            <Button
              className={cx("btn_login_as")}
              width="100%"
              height="50px"
              borderRadius="4px"
              background="#f2f2f2"
              border="1px solid #ccc"
            >
              {" "}
              Đăng nhập với Google{" "}
              <img className={cx("login_as_icon")} src={gg} alt="" />{" "}
            </Button>
            <Button
              className={cx("btn_login_as")}
              width="100%"
              height="50px"
              borderRadius="4px"
              background="#fff"
              border="1px solid #ccc"
            >
              {" "}
              Đăng nhập với Google{" "}
              <img className={cx("login_as_icon")} src={apple} alt="" />{" "}
            </Button>
            <div className={cx("redirect_register")}>
              {" "}
              Bạn chưa có tài khoản?{" "}
              <Link to="/register">
                <span className={cx("register_now")}> Đăng ký ngay </span>
              </Link>{" "}
            </div>
          </div>
          {/* <FontAwesomeIcon
            className={cx("close_form")}
            icon={faXmark}
            style={{ fontSize: "25px", cursor: "pointer" }}
          /> */}
        </form>
        <div className={cx("login_slider")}>
          <ImageSlider
            className={cx("login_image_slider")}
            classImage={cx("slider_image")}
            arrayImages={[bg, bg, bg, bg, bg]}
            widthIm="1200px"
            heightIm="500px"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
