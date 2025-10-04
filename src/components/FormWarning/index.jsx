import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./formWaring.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleDot } from '@fortawesome/free-solid-svg-icons';

const cx = classnames.bind(styles);

const FormWarning = ({ children, type }) => {
  const [showWarningForm, setShowWarningForm] = useState(false);

  const [typeObj, setTypeObj] = useState("");
  const [listReason, setListReason] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setTypeObj(type);
    return;
  }, [typeObj]);

  const reasonPost = [
    "Tin đăng không phù hợp",
    "Tin đăng không đúng mô tả",
    "Tin đăng có dấu hiệu lựa đảo",
    "Tin đăng chứa nội dung nhạy cảm",
  ];

  const reasonStatus = [
    "Bài viết không phù hợp",
    "Bài viết không đúng mô tả",
    "Bài viết có dấu hiệu lựa đảo",
    "Bài viết chứa nội dung nhạy cảm",
  ]

  const handleClickReason = () => {
    
  }
  return (
    <>
      {showWarningForm && <div className={cx("warning_container")}>
        <div className={cx("form_warning")}>
            <FontAwesomeIcon className={cx("close_form_icon")} icon={faXmark} onClick={() => setShowWarningForm(false)} />
            <h2 className={cx("form_Warning_title")}>{typeObj == "post" ? "Báo cáo tin đăng" : "Báo cáo bài viết"}</h2>

            <div className={cx("list_reason")}>
              {type == "post" && reasonPost.map((reason, index) => (
                <p key={index} className={cx("reason_item")}><FontAwesomeIcon className={cx("icon_item")} icon={faCircleDot} />{reason}</p>
              ))}
              {type == "status" && reasonStatus.map((reason, index) => (
                <p key={index} className={cx("reason_item")}>{reason}</p>
              ))}
            </div>
        </div>
        </div>}
      <span
        className={cx("trigger_warning")}
        onClick={() => setShowWarningForm(true)}
      >
        {children}
      </span>
    </>
  );
};

export default FormWarning;
