import classNames from "classnames/bind";
import style from "./Success.module.scss";
import Lottie from 'lottie-react';
import animationSuccess from '@animations/success.json';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(style);
const Success = ({width = 300, height = 300, loop=false, className}) => {
  return (
    <div className={cx("wrapper_success")}>
      <div className={cx("success")}>
          <Lottie animationData={animationSuccess} loop={loop} style={{width, height}} />
      </div>
    </div>
  );
};
export default Success;
