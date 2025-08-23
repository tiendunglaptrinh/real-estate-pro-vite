import classNames from "classnames/bind";
import style from "./Error.module.scss";
import Lottie from 'lottie-react';
import animationError from '@animations/error.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(style);
const Error = ({width = 300, height = 300, loop=false, className, message, onClick}) => {
  return (
    <div className={cx("wrapper_error")}>
      <div className={cx("error")}>
          <FontAwesomeIcon fontSize="20px" icon={faXmark} className={cx("icon_close")} onClick={onClick}/>
          <Lottie animationData={animationError} loop={loop} style={{width, height}} />
          <div className={cx("error_message")}>{message}</div>
      </div>
    </div>
  );
};
export default Error;
