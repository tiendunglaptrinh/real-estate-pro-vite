import style from "./Spinner.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(style);
const Spinner = () => {
  return (
    <div className={cx("spinner-overlay")}>
      <div className={cx("spinner")}></div>
    </div>
  );
};
export default Spinner;
