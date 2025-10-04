import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./formContact.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import RequireLogin from "../RequireLogin";
import { getCurrentUser, fetchApi } from "@utils/utils";
import { Spinner, Success, Error } from "@components/component"; 

const cx = classnames.bind(styles);

const FormContact = ({ children, receive_id }) => {
  const [showFormContact, setShowFormContact] = useState(false);
  const [content, setContent] = useState("Tôi có nhu cầu trao đổi. Hãy liên hệ cho tôi !!!");
  const [isLogin, setIsLogin] = useState(false);
  const [showRequireLogin, setShowRequireLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const user = await getCurrentUser();

      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      return;
    };
    checkLogin();
  }, []);

  const handleSubmitContact = async () => {
    setLoading(true);
    const body = {
      receive_id : receive_id,
      content
    }

    console.log("body: ", body);

    const url = "/contact/create"; 
    const response_data = await fetchApi(url, {
      body: body,
      method: "post",
      skipAuth: false
    });

    if (response_data.success) {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowFormContact(false);
      }, 2000);
      return;
    }
    else{ 
      setLoading(false);
      setShowError(true);
      return;
    }
  };

  return (
    <>
      { loading && <Spinner />}
      { showSuccess && <Success />}
      { showError && <Error message="Gửi yêu cầu liên hệ không thành công !!!" />}
      {!isLogin ? (
        <RequireLogin
          open={showRequireLogin}
          onClose={() => setShowRequireLogin(false)}
          onLogin={() => {
            setShowRequireLogin(false);
            navigate("/login");
          }}
        />
      ) : (
        showFormContact && (
          <div className={cx("contact_container")}>
            <div className={cx("form_contact")}>
              <FontAwesomeIcon
                icon={faXmark}
                className={cx("icon_close_form")}
                onClick={() => setShowFormContact(false)}
              />
              <h2 className={cx("contact_title")}>Yêu cầu liên hệ</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={200} // ⚠️ thêm giá trị nếu bạn muốn giới hạn ký tự
                spellCheck={false}
                className={cx("input_contact")}
                id="contact_input"
              />
              <div className={cx("wrap_btn")}>
                <button className={cx("btn_contact", "cancel")}>Hủy bỏ</button>
                <button
                  className={cx("btn_contact", "submit")}
                  onClick={handleSubmitContact}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <span
        className={cx("trigger_contact")}
        onClick={() => {
          if (isLogin) setShowFormContact(true);
          else setShowRequireLogin(true);
        }}
      >
        {children}
      </span>
    </>
  );
};

export default FormContact;
