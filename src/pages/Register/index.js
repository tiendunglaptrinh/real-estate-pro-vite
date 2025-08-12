import classNames from "classnames/bind";
import styles from "./register.module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button} from '../../components/component';
import axios from "axios";
import gg from "../../assets/images/google.png";
import apple from "../../assets/images/apple.png";

const cx = classNames.bind(styles);
const RegisterPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isLoggin, setLoggin] = useState(false);
  const [isShowSuccess, setShowSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [infoUser, setInfoUser] = useState("");
  const [error, setError] = useState(null);
  const handleInfoUserChange = (e) => {
    setInfoUser(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const handleRegisterClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const handleClose = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleClickSuccess = async () => {
    setShowSuccess(false);
    setShowLoginForm(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/account/login", {
        info_user: infoUser,
        password: password,
      });
      console.log(">> check response: ", response);
      console.log(">>> check type of ob: ", typeof response.status);
      if (response.status === 200) {
        setLoggin(true);
        setShowSuccess(true);
        localStorage.setItem("authToken", response.data.access_token);
        console.log(
          ">>> check access token: ",
          localStorage.getItem("authToken")
        );
      } else {
        setLoggin(false);
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (err) {
      setLoggin(false);
      setError("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggin(true);
    } else {
      setLoggin(false);
    }
  }, []);
  return (
    <div classNames={cx("wrapper_registerform")}>
      <div className={cx("wrapper_login")}>
        <div className={cx("login_content")}>
          <div className={cx("left_content")}>
            <div className={cx("slogan")}>Tìm nhà đất. Tìm chúng tôi</div>
          </div>
          <div className={cx("right_content")}>
            <div className={cx("hello")}>Xin chào bạn</div>
            <div className={cx("login_title")}>Đăng ký tài khoản mới</div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faUser} />
              <input type="text" placeholder="Họ và tên" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="password" placeholder="Ngày tháng năm sinh" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="text" placeholder="Email" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="text" placeholder="Nhập số điện thoại" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="text" placeholder="Số căn cước công dân" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="text" placeholder="Ngày cấp CCCD" />
            </div>
            <div className={cx("info_input")}>
              <FontAwesomeIcon className={cx("icon_input")} icon={faLock} />
              <input type="text" placeholder="Nơi cấp CCCD" />
            </div>
          </div>
          <FontAwesomeIcon
            className={cx("close_form")}
            icon={faXmark}
            style={{ fontSize: "25px", cursor: "pointer" }}
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
