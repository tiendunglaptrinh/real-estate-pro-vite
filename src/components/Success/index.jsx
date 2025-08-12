import classNames from "classnames/bind";
import style from "./Success.module.scss";
import { Button } from "@components/component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const cx = classNames.bind(style);
const Success = ({onClick}) => {
  return (
    <div className={cx("wrapper_success")}>
      <div className={cx("success")}>
        <div className={cx("tick")}>
          <FontAwesomeIcon className={cx("icon")} icon={faCheck} />
        </div>
        <div className={cx("title")}>Đăng nhập thành công</div>
        <div className={cx("text")}>
          Chào mừng bạn quay trở lại Homepro. Nền tảng cho phép quản lý tìm kiếm
          bất động sản nhanh chóng
        </div>
        <Link to="/">
          <Button
            width="100%"
            height="50px"
            borderRadius="7px"
            background="#6dbd30"
            fontSize="18px"
            color="#fff"
            onClick={onClick}
          >
            Đi tới trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default Success;
